import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity';
import { Notification, NotificationType } from '../notification/entities/notification.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

const SYSTEM_ROLES = ['Administrateur', 'Utilisateur connecté'];
const SUPER_ADMIN_ROLE = 'SUPER_ADMIN';

@Injectable()
export class RoleService {
  private readonly superAdminEmail: string;
  private readonly superAdminName: string;
  private readonly appName: string;
  private readonly appUrl: string;

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,

    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,

    private mailerService: MailerService,
    private configService: ConfigService,
  ) {
    this.superAdminEmail = this.configService.get<string>('SUPER_ADMIN_EMAIL') || 'superadmin@votreapp.com';
    this.superAdminName = this.configService.get<string>('SUPER_ADMIN_NAME') || 'Super Administrateur';
    this.appName = this.configService.get<string>('APP_NAME') || 'Application';
    this.appUrl = this.configService.get<string>('APP_URL') || 'https://votreapp.com';
  }

  // ------------------------------------------------------------------ helpers

  private isProtected(nomRole: string): boolean {
    return nomRole === SUPER_ADMIN_ROLE;
  }

  private isSystemRole(nomRole: string): boolean {
    return SYSTEM_ROLES.includes(nomRole);
  }

  private async createNotification(
    utilisateur: Utilisateur,
    titre: string,
    contenu: string,
    type: NotificationType = NotificationType.SYSTEME,
  ): Promise<void> {
    const notif = this.notificationRepository.create({
      titre,
      contenu,
      type,
      lu: false,
      utilisateur,
    });
    await this.notificationRepository.save(notif);
  }

  /**
   * Génère un email HTML professionnel avec thème light purple, icônes et mise en page responsive.
   * @param title Titre de l'email (affiché dans l'objet et dans le corps)
   * @param content Contenu textuel principal
   * @param icon Emoji ou URL d'icône (optionnel, sera détecté automatiquement si non fourni)
   */
  private buildEmailHtml(title: string, content: string, icon?: string): string {
    // Détection intelligente de l'icône selon le contenu
    let detectedIcon = icon || '📢';
    if (content.includes('assigné') || title.includes('assigné')) {
      detectedIcon = icon || '🔖';
    } else if (content.includes('retiré') || title.includes('retiré')) {
      detectedIcon = icon || '🗑️';
    } else if (content.includes('activé') || title.includes('activé')) {
      detectedIcon = icon || '✅';
    } else if (content.includes('désactivé') || title.includes('désactivé')) {
      detectedIcon = icon || '⛔';
    }

    // Couleurs light purple modernes
    const primaryColor = '#a78bfa';   // violet clair (Tailwind violet-400)
    const primaryDark = '#8b5cf6';    // violet un peu plus soutenu
    const lightBg = '#faf5ff';        // fond très clair violet
    const cardBg = '#ffffff';
    const textColor = '#1f2937';
    const textLight = '#6b7280';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(title)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: ${lightBg};
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
    }
    .container {
      max-width: 560px;
      margin: 30px auto;
      background: ${cardBg};
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02);
    }
    .header {
      background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryDark} 100%);
      padding: 32px 24px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 600;
      letter-spacing: -0.3px;
    }
    .header p {
      margin: 8px 0 0;
      opacity: 0.9;
      font-size: 15px;
    }
    .content {
      padding: 32px 28px;
      color: ${textColor};
    }
    .icon {
      text-align: center;
      font-size: 64px;
      margin-bottom: 20px;
    }
    h2 {
      color: ${primaryDark};
      font-size: 22px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 16px;
      text-align: center;
    }
    .message {
      background: #f9f9ff;
      padding: 20px;
      border-radius: 18px;
      margin: 24px 0;
      border-left: 4px solid ${primaryColor};
      font-size: 16px;
    }
    .button {
      display: inline-block;
      background: ${primaryColor};
      color: white !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 40px;
      font-weight: 500;
      font-size: 15px;
      transition: background 0.2s;
      margin: 16px 0 8px;
      box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
    }
    .button:hover {
      background: ${primaryDark};
    }
    .footer {
      background: #faf9fe;
      padding: 20px 24px;
      text-align: center;
      font-size: 12px;
      color: ${textLight};
      border-top: 1px solid #ede9fe;
    }
    .footer a {
      color: ${primaryColor};
      text-decoration: none;
    }
    @media (max-width: 600px) {
      .container { margin: 16px; border-radius: 20px; }
      .content { padding: 24px 20px; }
      .header { padding: 24px 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${this.escapeHtml(this.appName)}</h1>
      <p>Gestion des rôles et permissions</p>
    </div>
    <div class="content">
      <div class="icon">${detectedIcon}</div>
      <h2>${this.escapeHtml(title)}</h2>
      <div class="message">
        ${this.escapeHtml(content).replace(/\n/g, '<br>')}
      </div>
     
    </div>
    <div class="footer">
      <p>Cet email a été envoyé automatiquement par le super-administrateur.<br>
      <a href="${this.appUrl}">${this.appName}</a> – Plateforme sécurisée</p>
      <p>&copy; ${new Date().getFullYear()} Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>`;
  }

  // Échappement basique pour éviter XSS dans les emails
  private escapeHtml(str: string): string {
    return str
      .replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      })
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
      });
  }

  /**
   * Envoie un email au nom du super-administrateur, avec version HTML professionnelle.
   * @param to Destinataire
   * @param subject Sujet
   * @param text Contenu texte brut (sera utilisé comme fallback)
   */
  private async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      const htmlContent = this.buildEmailHtml(subject, text);
      await this.mailerService.sendMail({
        from: `"${this.superAdminName}" <${this.superAdminEmail}>`,
        to,
        subject,
        text, // fallback pour clients sans HTML
        html: htmlContent,
      });
    } catch (err) {
      console.error(`[RoleService] Échec envoi email à ${to} :`, err.message);
    }
  }

  // ------------------------------------------------------------------ CRUD

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existing = await this.roleRepository.findOne({
      where: { nom: createRoleDto.nom },
    });
    if (existing) {
      throw new ConflictException(
        `Un rôle avec le nom "${createRoleDto.nom}" existe déjà`,
      );
    }
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['utilisateurs'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['utilisateurs'],
    });
    if (!role) {
      throw new NotFoundException(`Rôle avec l'ID ${id} non trouvé`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    let role = await this.findOne(id);

    if (this.isProtected(role.nom)) {
      throw new ForbiddenException(
        `Le rôle "${SUPER_ADMIN_ROLE}" ne peut pas être modifié`,
      );
    }

    if (
      this.isSystemRole(role.nom) &&
      updateRoleDto.nom &&
      updateRoleDto.nom !== role.nom
    ) {
      throw new ForbiddenException(
        `Le nom du rôle système "${role.nom}" ne peut pas être modifié`,
      );
    }

    if (updateRoleDto.nom && updateRoleDto.nom !== role.nom) {
      const existing = await this.roleRepository.findOne({
        where: { nom: updateRoleDto.nom },
      });
      if (existing) {
        throw new ConflictException(
          `Un rôle avec le nom "${updateRoleDto.nom}" existe déjà`,
        );
      }
    }

    const statutChange =
      updateRoleDto.actif !== undefined && updateRoleDto.actif !== role.actif;

    Object.assign(role, updateRoleDto);
    let saved = await this.roleRepository.save(role);

    if (statutChange) {
      saved = await this.findOne(saved.id);
    }

    if (statutChange && saved.utilisateurs?.length) {
      const nouvelEtat = saved.actif ? 'activé' : 'désactivé';
      const titre = `Votre rôle "${saved.nom}" a été ${nouvelEtat}`;
      const contenu = `Le rôle "${saved.nom}" qui vous est assigné vient d'être ${nouvelEtat} par le super-administrateur.`;

      for (const user of saved.utilisateurs) {
        await this.createNotification(user, titre, contenu);
        if (user.email) await this.sendEmail(user.email, titre, contenu);
      }
    }

    return saved;
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);

    if (this.isProtected(role.nom)) {
      throw new ForbiddenException(
        `Le rôle "${SUPER_ADMIN_ROLE}" ne peut pas être supprimé`,
      );
    }
    if (this.isSystemRole(role.nom)) {
      throw new ForbiddenException(
        `Le rôle système "${role.nom}" ne peut pas être supprimé`,
      );
    }
    if (role.utilisateurs?.length > 0) {
      throw new ConflictException(
        `Impossible de supprimer le rôle "${role.nom}" car il est utilisé par ${role.utilisateurs.length} utilisateur(s)`,
      );
    }

    await this.roleRepository.remove(role);
  }

  // ------------------------------------------------------------------ TOGGLE STATUT

  async toggleStatut(id: number): Promise<Role> {
    let role = await this.findOne(id);

    if (this.isProtected(role.nom)) {
      throw new ForbiddenException(
        `Le rôle "${SUPER_ADMIN_ROLE}" ne peut pas être modifié`,
      );
    }

    role.actif = !role.actif;
    let saved = await this.roleRepository.save(role);
    saved = await this.findOne(saved.id);

    const nouvelEtat = saved.actif ? 'activé' : 'désactivé';
    const titre = `Votre rôle "${saved.nom}" a été ${nouvelEtat}`;
    const contenu = `Le rôle "${saved.nom}" qui vous est assigné vient d'être ${nouvelEtat} par le super-administrateur.`;

    for (const user of saved.utilisateurs ?? []) {
      await this.createNotification(user, titre, contenu);
      if (user.email) await this.sendEmail(user.email, titre, contenu);
    }

    return saved;
  }

  // ------------------------------------------------------------------ ASSIGNATION

  async assignRoleToUser(roleId: number, userId: number): Promise<Utilisateur> {
    const role = await this.findOne(roleId);
    const user = await this.utilisateurRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    user.role = role;
    const saved = await this.utilisateurRepository.save(user);

    const titre = `Nouveau rôle assigné : "${role.nom}"`;
    const contenu = `Le super-administrateur vous a assigné le rôle "${role.nom}".`;
    await this.createNotification(user, titre, contenu);
    if (user.email) await this.sendEmail(user.email, titre, contenu);

    return saved;
  }

  async assignRoleToUsers(
    roleId: number,
    userIds: number[],
  ): Promise<{ message: string; updated: number }> {
    const role = await this.findOne(roleId);
    const users = await this.utilisateurRepository.find({
      where: { id: In(userIds) },
    });

    if (users.length === 0) {
      throw new NotFoundException(`Aucun utilisateur trouvé avec les IDs fournis`);
    }

    for (const user of users) user.role = role;
    await this.utilisateurRepository.save(users);

    const titre = `Nouveau rôle assigné : "${role.nom}"`;
    const contenu = `Le super-administrateur vous a assigné le rôle "${role.nom}".`;

    for (const user of users) {
      await this.createNotification(user, titre, contenu);
      if (user.email) await this.sendEmail(user.email, titre, contenu);
    }

    return {
      message: `${users.length} utilisateur(s) ont été assignés au rôle "${role.nom}" par le super-administrateur`,
      updated: users.length,
    };
  }

  async unassignRoleFromUser(userId: number): Promise<Utilisateur> {
    const user = await this.utilisateurRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    const ancienRole = user.role?.nom ?? 'inconnu';
    user.role = null;
    const saved = await this.utilisateurRepository.save(user);

    const titre = `Rôle retiré`;
    const contenu = `Le rôle "${ancienRole}" vous a été retiré par le super-administrateur.`;
    await this.createNotification(user, titre, contenu);
    if (user.email) await this.sendEmail(user.email, titre, contenu);

    return saved;
  }
}