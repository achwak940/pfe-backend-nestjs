import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { OAuth2Client } from 'google-auth-library';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { Status } from 'src/utilisateur/status.enum';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthentificationService {
  private client: OAuth2Client;

  // Stockage en mémoire des tentatives de renvoi (en prod → Redis)
  // clé: email, valeur: timestamp du dernier envoi
  private lastSentMap = new Map<string, number>();

  // Délai minimum entre deux envois : 5 minutes
  private readonly RESEND_DELAY_MS = 5 * 60 * 1000;

  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepo: Repository<Utilisateur>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  // ================= LOGIN EMAIL =================
  async authentificationEmail(body: { email: string; mot_de_passe: string }) {
    const { email, mot_de_passe } = body;

    if (!email?.trim()) return { erreur: "L'email est obligatoire" };
    if (!mot_de_passe?.trim())
      return { erreur: 'Le mot de passe est obligatoire' };

    const utilisateur = await this.utilisateurRepo.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!utilisateur) return { erreur: "Email n'existe pas" };

    const mot_de_passe_valide = await bcrypt.compare(
      mot_de_passe,
      utilisateur.mot_de_passe,
    );

    if (!mot_de_passe_valide) return { erreur: 'Mot de passe incorrect' };

    if (!utilisateur.est_verifie) {
      return { erreur: "Votre compte n'est pas vérifié" };
    }

    const user = {
      id: utilisateur.id,
      email: utilisateur.email,
      role: utilisateur.role?.nom,
      prenom: utilisateur.prenom,
      nom: utilisateur.nom,
      photo_profil: utilisateur.photo_profil,
    };

    const token = this.jwtService.sign(user);
    return { message: 'Authentification réussie', token, user };
  }

  // ================= GOOGLE LOGIN =================
  async authentificationGoogle(token: string) {
    if (!token) return { erreur: 'Token Google obligatoire' };

    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload?.email) return { erreur: 'Token Google invalide' };

      let utilisateur = await this.utilisateurRepo.findOne({
        where: { email: payload.email },
        relations: ['role'],
      });

      if (!utilisateur) {
        const newUtilisateur = new Utilisateur();
        newUtilisateur.email = payload.email;
        newUtilisateur.prenom = payload.given_name || '';
        newUtilisateur.nom = payload.family_name || '';
        newUtilisateur.photo_profil = payload.picture || '';
        newUtilisateur.est_verifie = true;
        newUtilisateur.statut = Status.INACTIF;
        newUtilisateur.mot_de_passe = 'GOOGLE_AUTH_USER';
        utilisateur = await this.utilisateurRepo.save(newUtilisateur);
      }

      const user = {
        id: utilisateur.id,
        email: utilisateur.email,
        role: utilisateur.role?.nom,
        prenom: utilisateur.prenom,
        nom: utilisateur.nom,
        photo_profil: utilisateur.photo_profil,
      };

      const tokenJwt = this.jwtService.sign(user);
      return {
        message: 'Authentification Google réussie',
        token: tokenJwt,
        user,
      };
    } catch (error) {
      console.error(error);
      return { erreur: 'Token Google invalide' };
    }
  }

  // ================= FORGOT PASSWORD =================
  async forgotPassword(email: string) {
    if (!email?.trim()) return { erreur: 'Email obligatoire' };

    const utilisateur = await this.utilisateurRepo.findOne({
      where: { email },
    });

    // Sécurité : ne pas révéler si l'email existe ou non
    if (!utilisateur) {
      return { message: 'Si ce compte existe, un email a été envoyé.' };
    }

    // ── Vérification du délai de renvoi (5 minutes) ──────────────────────
    const lastSent = this.lastSentMap.get(email);
    const now = Date.now();

    if (lastSent) {
      const elapsed = now - lastSent;
      if (elapsed < this.RESEND_DELAY_MS) {
        const remainingSeconds = Math.ceil(
          (this.RESEND_DELAY_MS - elapsed) / 1000,
        );
        return {
          erreur: `Veuillez patienter encore ${remainingSeconds} secondes avant de renvoyer un lien.`,
          remainingSeconds,
        };
      }
    }

    // ── Génération du token JWT (expire dans 5 minutes) ──────────────────
    
    const resetToken = this.jwtService.sign(
      { email: utilisateur.email, sub: utilisateur.id, type: 'reset' },
      { expiresIn: '5m' }, 
    );

    const frontendUrl = this.configService.get(
      'FRONTEND_URL',
      'http://localhost:4200',
    );
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    // ── Envoi de l'email avec template HTML stylé ─────────────────────────
    await this.mailerService.sendMail({
      to: utilisateur.email,
      subject: '🔐 Réinitialisation de votre mot de passe',
      html: this.buildResetEmailHtml(
        utilisateur.prenom || utilisateur.email,
        resetLink,
      ),
      text: `Bonjour ${utilisateur.prenom || ''},\n\nCliquez sur ce lien pour réinitialiser votre mot de passe (valable 5 minutes) :\n${resetLink}\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.`,
    });

    // ── Enregistrer le timestamp d'envoi ─────────────────────────────────
    this.lastSentMap.set(email, now);

    // Nettoyage automatique après le délai
    setTimeout(() => this.lastSentMap.delete(email), this.RESEND_DELAY_MS);

    return {
      message:
        'Un lien de réinitialisation a été envoyé à votre adresse email. Il expire dans 5 minutes.',
    };
  }

  // ================= RESET PASSWORD =================
  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword?.trim()) {
      return { erreur: 'Token et mot de passe requis' };
    }

    if (newPassword.length < 8) {
      return { erreur: 'Le mot de passe doit contenir au moins 8 caractères' };
    }

    try {

      const payload = this.jwtService.verify(token);

      // Vérifier que c'est bien un token de type "reset"
      if (payload.type !== 'reset') {
        return { erreur: 'Token invalide' };
      }

      const utilisateur = await this.utilisateurRepo.findOne({
        where: { email: payload.email },
      });

      if (!utilisateur) return { erreur: 'Utilisateur non trouvé' };

      utilisateur.mot_de_passe = await bcrypt.hash(newPassword, 12);
      
      await this.utilisateurRepo.save(utilisateur);

      // Invalider la clé de renvoi pour cet email (optionnel, propre)
      this.lastSentMap.delete(payload.email);

      return { message: 'Mot de passe modifié avec succès !' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return {
          erreur:
            'Le lien a expiré. Veuillez demander un nouveau lien de réinitialisation.',
          expired: true,
        };
      }
      return { erreur: 'Token expiré ou invalide' };
    }
  }

  // ================= TEMPLATE EMAIL HTML =================
private buildResetEmailHtml(prenom: string, resetLink: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Réinitialisation de mot de passe</title>
</head>
<body style="margin:0;padding:0;background:#f4f0fc;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background:#f4f0fc;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <!-- Card -->
        <table width="580" cellpadding="0" cellspacing="0" border="0"
               style="max-width:580px;background:#ffffff;
                      border-radius:24px;border:1px solid #e4d5f5;
                      box-shadow:0 20px 40px rgba(110, 79, 160, 0.1);">

          <!-- Top accent bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#b794f4,#9f7aea,#805ad5);
                       border-radius:24px 24px 0 0;"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding:44px 48px 32px;">
              <!-- Logo / Icon -->
              <div style="width:72px;height:72px;margin:0 auto 24px;
                          background:linear-gradient(135deg,#b794f4,#9f7aea);
                          border-radius:20px;display:inline-flex;align-items:center;
                          justify-content:center;box-shadow:0 10px 20px rgba(110,79,160,0.2);">
                <img src="https://img.icons8.com/ios-filled/50/ffffff/lock--v1.png"
                     width="36" height="36" alt="lock"
                     style="display:block;margin:0 auto;"/>
              </div>

              <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;
                         color:#1a1a2e;letter-spacing:-0.5px;">
                Réinitialisation de mot de passe
              </h1>
              <p style="margin:0;font-size:15px;color:#5a4a7a;line-height:1.5;">
                Une demande a été faite pour votre compte
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#d4c4f0,transparent);"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 48px;">
              <p style="margin:0 0 16px;font-size:15px;color:#2d2d3e;line-height:1.7;">
                Bonjour <strong style="color:#6b46c0;">${prenom}</strong>,
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#4a3a6a;line-height:1.7;">
                Nous avons reçu une demande de réinitialisation du mot de passe associé à votre compte.
                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
              </p>

              <!-- Alert box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#f0eaff;border:1px solid #d6c4f0;
                            border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:32px;vertical-align:top;padding-top:2px;">
                          <span style="font-size:18px;">⏱️</span>
                        </td>
                        <td style="padding-left:12px;">
                          <p style="margin:0;font-size:13px;font-weight:600;
                                     color:#805ad5;letter-spacing:0.3px;">
                            LIEN VALABLE 5 MINUTES SEULEMENT
                          </p>
                          <p style="margin:4px 0 0;font-size:13px;color:#6b5a8a;line-height:1.5;">
                            Pour votre sécurité, ce lien expire rapidement. Si vous n'avez pas
                            demandé cette réinitialisation, ignorez cet email.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${resetLink}"
                       style="display:inline-block;padding:16px 44px;
                              background:linear-gradient(135deg,#b794f4,#805ad5);
                              color:#ffffff;text-decoration:none;border-radius:14px;
                              font-size:15px;font-weight:700;letter-spacing:0.3px;
                              box-shadow:0 6px 16px rgba(110,79,160,0.25);
                              transition:all 0.2s;">
                      🔐 &nbsp; Réinitialiser mon mot de passe
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:28px 0 0;font-size:12px;color:#8a79a0;text-align:center;line-height:1.6;">
                Bouton non fonctionnel ? Copiez ce lien dans votre navigateur :<br/>
                <a href="${resetLink}"
                   style="color:#805ad5;word-break:break-all;font-size:11px;">${resetLink}</a>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#e0d0f5,transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 48px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#9a8ab5;line-height:1.6;">
                Cet email a été envoyé automatiquement — ne pas répondre.<br/>
                Si vous n'êtes pas à l'origine de cette demande, votre compte est sécurisé.
              </p>
              <p style="margin:16px 0 0;font-size:13px;color:#7c6ba5;font-weight:600;">
                © ${new Date().getFullYear()} &nbsp;·&nbsp; Votre Application
              </p>
            </td>
          </tr>

          <!-- Bottom accent bar -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#805ad5,#9f7aea,#b794f4);
                       border-radius:0 0 24px 24px;"></td>
          </tr>

        <table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
</body>
</html>`;
} 
}
  