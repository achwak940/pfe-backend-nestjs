import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonWebTokenError } from 'jsonwebtoken';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { json } from 'stream/consumers';
import { Repository } from 'typeorm';

@Injectable()
export class AuthentificationService {
    constructor(@InjectRepository(Utilisateur) private utilisateurRepo: Repository<Utilisateur>,
  private readonly jwtService: JwtService
  ){
    }
    async authentificationEmail(body){
        const email=body.email
        const mot_de_passe=body.mot_de_passe
        if(!email?.trim()){
            return {erreur:"L'email est obligatoire"}
          }
          if(!mot_de_passe?.trim()){
            return {erreur:"Le mot de passe est obligatoire"}
          }
          const utilisateur=await this.utilisateurRepo.findOne({where:{email}})
          if(!utilisateur){
            return {erreur:"Email  n'existe pas"}
          }
         
          const bcrypt = require('bcrypt');
          const mot_de_passe_valide=await bcrypt.compare(mot_de_passe,utilisateur.mot_de_passe)
          if(!mot_de_passe_valide){
            return {erreur:"Mot de passe incorrect"}
          }
          if(!utilisateur.est_verifie){
            return {erreur:"Votre compte n'est pas vérifié. Veuillez vérifier votre email."}
          }
          const user= { id: utilisateur.id, email: utilisateur.email, role: utilisateur.role ,prenom: utilisateur.prenom, nom: utilisateur.nom};
          const token = this.jwtService.sign(user);
         
          
          return {message:"Authentification réussie",token,user}
  
    }
}
