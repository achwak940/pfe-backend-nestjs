import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { Role } from 'src/utilisateur/role.enum';
import { Status } from 'src/utilisateur/status.enum';
import { Repository } from 'typeorm';



@Injectable()
export class AuthentificationService {
    private client: OAuth2Client;

    constructor(
        @InjectRepository(Utilisateur) private utilisateurRepo: Repository<Utilisateur>,
        private readonly jwtService: JwtService
    ) {
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async authentificationEmail(body: { email: string; mot_de_passe: string }) {
        const email = body.email;
        const mot_de_passe = body.mot_de_passe;
        
        if (!email?.trim()) {
            return { erreur: "L'email est obligatoire" };
        }
        if (!mot_de_passe?.trim()) {
            return { erreur: "Le mot de passe est obligatoire" };
        }
        
        const utilisateur = await this.utilisateurRepo.findOne({ where: { email } });
        if (!utilisateur) {
            return { erreur: "Email n'existe pas" };
        }
        
        const bcrypt = require('bcrypt');
        const mot_de_passe_valide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
        if (!mot_de_passe_valide) {
            return { erreur: "Mot de passe incorrect" };
        }
        
        if (!utilisateur.est_verifie) {
            return { erreur: "Votre compte n'est pas vérifié. Veuillez vérifier votre email." };
        }
        
        const user = { 
            id: utilisateur.id, 
            email: utilisateur.email, 
            role: utilisateur.role,
            prenom: utilisateur.prenom, 
            nom: utilisateur.nom,
            photo_profil: utilisateur.photo_profil
        };
        
        const token = this.jwtService.sign(user);
        
        return { message: "Authentification réussie", token, user };
    }

    async authentificationGoogle(token: string) {
        if (!token) {
            return { erreur: "Token Google obligatoire" };
        }

        try {
            // 1. Verify Google token
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            if (!payload?.email) {
                return { erreur: "Token Google invalide" };
            }

            // 2. chercher utilisateur
            let utilisateur = await this.utilisateurRepo.findOne({
                where: { email: payload.email }
            });

            // 3. create si non existant
            if (!utilisateur) {
                const newUtilisateur = new Utilisateur();
                newUtilisateur.email = payload.email;
                newUtilisateur.prenom = payload.given_name || '';
                newUtilisateur.nom = payload.family_name || '';
                newUtilisateur.photo_profil = payload.picture || '';
                newUtilisateur.est_verifie = true;
                newUtilisateur.role = Role.USER_CONNECTE;
                newUtilisateur.statut = Status.INACTIF;
                newUtilisateur.mot_de_passe = 'GOOGLE_AUTH_USER';
                
                utilisateur = await this.utilisateurRepo.save(newUtilisateur);
            }

            // 4. safety check
            if (!utilisateur) {
                return { erreur: "Erreur création utilisateur" };
            }

            // 5. build response
            const user = {
                id: utilisateur.id,
                email: utilisateur.email,
                role: utilisateur.role,
                prenom: utilisateur.prenom,
                nom: utilisateur.nom,
                photo_profil: utilisateur.photo_profil
            };

            // 6. generate JWT
            const tokenJwt = this.jwtService.sign(user);

            return {
                message: "Authentification Google réussie",
                token: tokenJwt,
                user
            };

        } catch (error) {
            console.error('Erreur authentification Google:', error);
            return { erreur: "Token Google invalide" };
        }
    }
}