import { Injectable } from '@nestjs/common';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { Utilisateur } from './entities/utilisateur.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { text } from 'stream/consumers';
@Injectable()
export class UtilisateurService {
  constructor(@InjectRepository(Utilisateur) private utilisateurRepository: Repository<Utilisateur>){
  }
  async create(createUtilisateurDto: CreateUtilisateurDto) {
    const prenom=createUtilisateurDto.prenom
    const nom=createUtilisateurDto.nom
    const email=createUtilisateurDto.email
    const mot_de_passe=createUtilisateurDto.mot_de_passe
    if(!prenom?.trim()){
      return {erreur:"Le prenom est obligatoire"}
    }
    if(!nom?.trim()){
      return {erreur:"Le nom est obligatoire"}
    }
    if(!email?.trim()){
      return {erreur:"L'email est obligatoire"}
    }
    if(!mot_de_passe?.trim()){
      return {erreur:"Le mot de passe est obligatoire"}
    }
     if(!email.includes("@")){
      return {erreur:"L'email doit contenir @"}
    }
     if(!email.includes(".")){
      return {erreur:"L'email doit contenir ."}
    }
    if(email.indexOf("@")==0){
      return {erreur:"L'email doit contenir des caractères avant @"}
    }
    if(email.lastIndexOf(".")==email.length-1){
      return {erreur:"L'email doit contenir des caractères après ."}

    }
    if(mot_de_passe.length<8){
      return {erreur:"Le mot de passe doit contenir au moins 8 caractères"}
    }
   if(!/[A-Z]/.test(mot_de_passe)){
      return {erreur:"Le mot de passe doit contenir au moins une majuscule"}
    }
   if(!/[0-9]/.test(mot_de_passe)){
      return {erreur:"Le mot de passe doit contenir au moins un chiffre"}
    }
    if(!/[@$!%*?&]/.test(mot_de_passe)){
      return {erreur:"Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)"}
    }
    if(await this.utilisateurRepository.findOne({ where: { email } })){
      return {erreur:"L'email existe déjà"}
    }
  const  bcrypt = require('bcrypt');
    const mot_de_passe_hache=await bcrypt.hash(mot_de_passe,10)
     const token = require('crypto').randomBytes(16).toString('hex');
     const token_expiration=new Date(Date.now() + 5 * 60 * 1000);// le token expire dans 5 minutes
  const utilisateur = this.utilisateurRepository.create({
    prenom,
    nom,
    email,
    mot_de_passe:mot_de_passe_hache,
    code_verification:token,
    token_expiration:token_expiration
  })
  await this.utilisateurRepository.save(utilisateur);
  const lienverification=`https://intactly-leal-beverley.ngrok-free.dev/utilisateur/verification?token=${token}`
  //creation du mail
  const creationemail={
    from:"belliliachwek@gmail.com",
    to:email,
    subject:"Vérification de votre compte",
    html:
    `<p>Bonjour ${prenom},</p>
    <p>Veuillez cliquer sur le lien suivant pour vérifier votre compte : <a href="${lienverification}">Vérifier mon compte</a></p>
    <p>Ce lien exprie dans 5 minutes.</p>
    <p>Si vous n'avez pas créé de compte, veuillez ignorer cet email.</p>`
  }
  const nodemailer = require('nodemailer');
  const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:"belliliachwek@gmail.com",
      pass:"ujgu vylh uuiz yhzh"
    }
    
  })
  //envoi du mail
  try{
    await transporter.sendMail(creationemail);
  }catch(error){
    console.error("Erreur lors de l'envoi de l'email de vérification :",error);
  }
  return {message:"Utilisateur créé avec succès"}
   
  }
  async verificationToken(token:string){
    const utilisateur=await this.utilisateurRepository.findOne({where:{code_verification:token}})
    if(!utilisateur){
      return {erreur:"Token de vérification invalide"}
    }
    if(!utilisateur.token_expiration || utilisateur.token_expiration < new Date()){
      return {erreur:"Token de vérification expiré"}
    }
    utilisateur.est_verifie=true;
    utilisateur.code_verification=null;
    utilisateur.token_expiration=null;

    await this.utilisateurRepository.save(utilisateur);
    return {message:"Compte vérifié avec succès"}
   
  }
  findAll() {
    return `This action returns all utilisateur`;
  }
  findOne(id: number) {
    return `This action returns a #${id} utilisateur`;
  }
  update(id: number, updateUtilisateurDto: UpdateUtilisateurDto) {
    return `This action updates a #${id} utilisateur`;
  }

  remove(id: number) {
    return `This action removes a #${id} utilisateur`;
  }
}
