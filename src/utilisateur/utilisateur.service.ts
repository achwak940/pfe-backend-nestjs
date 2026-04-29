import { Body, Injectable, Post } from '@nestjs/common';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { Utilisateur } from './entities/utilisateur.entity';
import { And, Between, getRepository, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { text } from 'stream/consumers';
import { Status } from './status.enum';
import { Role } from './role.enum';
import { Enquete } from 'src/enquete/entities/enquete.entity';
import { StatusEnquete } from 'src/enquete/entities/status.enum';
import { interval } from 'rxjs';
import { Reponse } from 'src/reponse/entities/reponse.entity';
import * as ExcelJS from 'exceljs';
import { execFile } from 'child_process';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import path from 'path';
import { Parser } from 'json2csv';
import * as fs from 'fs';
@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
    @InjectRepository(Enquete) private enqueteRepo: Repository<Enquete>,
    @InjectRepository(Reponse) private reponseRepo: Repository<Reponse>,
  ) {}
async create(
  createUtilisateurDto: CreateUtilisateurDto,
  file?: Express.Multer.File,
) {
  const { prenom, nom, email, mot_de_passe ,telephone} = createUtilisateurDto;

  // ================= VALIDATION =================
  if (!prenom?.trim()) return { erreur: 'Le prenom est obligatoire' };
  if (!nom?.trim()) return { erreur: 'Le nom est obligatoire' };
  if (!email?.trim()) return { erreur: "L'email est obligatoire" };
  if (!mot_de_passe?.trim()) return { erreur: 'Le mot de passe est obligatoire' };

  if (!email.includes('@')) return { erreur: "L'email doit contenir @" };
  if (!email.includes('.')) return { erreur: "L'email doit contenir ." };
  if (email.indexOf('@') === 0)
    return { erreur: "L'email doit contenir des caractères avant @" };
  if (email.lastIndexOf('.') === email.length - 1)
    return { erreur: "L'email doit contenir des caractères après ." };

  if (mot_de_passe.length < 8)
    return { erreur: 'Le mot de passe doit contenir au moins 8 caractères' };

  if (!/[A-Z]/.test(mot_de_passe))
    return { erreur: 'Le mot de passe doit contenir au moins une majuscule' };

  if (!/[0-9]/.test(mot_de_passe))
    return { erreur: 'Le mot de passe doit contenir au moins un chiffre' };

  if (!/[@$!%*?&]/.test(mot_de_passe))
    return {
      erreur: 'Le mot de passe doit contenir au moins un caractère spécial',
    };

  // ================= CHECK EMAIL =================
  const exist = await this.utilisateurRepository.findOne({
    where: { email },
  });

  if (exist) return { erreur: "L'email existe déjà" };

  // ================= IMAGE PROFILE =================
  let photo_profil: string | undefined = undefined;
  if (file) {
    photo_profil = `/uploads/profiles/${file.filename}`;
  }

  // ================= HASH PASSWORD =================
  const bcrypt = require('bcrypt');
  const crypto = require('crypto');

  const mot_de_passe_hache = await bcrypt.hash(mot_de_passe, 10);

  // ================= TOKEN =================
  const token = crypto.randomBytes(16).toString('hex');
  const token_expiration = new Date(Date.now() + 5 * 60 * 1000);

  // ================= CREATE USER =================
  const utilisateur = this.utilisateurRepository.create({
    prenom,
    nom,
    email,
    mot_de_passe: mot_de_passe_hache,
    code_verification: token,
    token_expiration,
    statut: Status.INACTIF,
    photo_profil,
    telephone

    
  });

  await this.utilisateurRepository.save(utilisateur);

  // ================= EMAIL =================
  const lienverification = `https://intactly-leal-beverley.ngrok-free.dev/utilisateur/verification?token=${token}`;

  const creationemail = {
    from: 'belliliachwek@gmail.com',
    to: email,
    subject: 'Vérification de votre compte',
    html: `
      <p>Bonjour ${prenom},</p>
      <p>Veuillez cliquer sur le lien suivant pour vérifier votre compte :</p>
      <a href="${lienverification}">Vérifier mon compte</a>
      <p>Ce lien expire dans 5 minutes.</p>
      <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
    `,
  };

  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'belliliachwek@gmail.com',
      pass: 'ujgu vylh uuiz yhzh',
    },
  });

  try {
    await transporter.sendMail(creationemail);
  } catch (error) {
    console.error("Erreur email:", error);
  }

  return {
    message: 'Utilisateur créé avec succès',
    photo_profil,
  };
}
  async verificationToken(token: string) {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { code_verification: token },
    });
    if (!utilisateur) {
      return { erreur: 'Token de vérification invalide' };
    }
    if (
      !utilisateur.token_expiration ||
      utilisateur.token_expiration < new Date()
    ) {
      return { erreur: 'Token de vérification expiré' };
    }
    utilisateur.est_verifie = true;
    utilisateur.code_verification = null;
    utilisateur.statut = Status.ACTIF;
    utilisateur.token_expiration = null;
    await this.utilisateurRepository.save(utilisateur);
    return { message: 'Compte vérifié avec succès' };
  }
  getAllusers() {
    return this.utilisateurRepository.find();
  }
  async FindUserById(id: number) {
    return this.utilisateurRepository.findOne({ where: { id } });
  }
  async changeStatus(id: number, statut: Status) {
    const user = await this.FindUserById(id);
    if (!user) {
      return { erreur: 'Utilisateur inconnu' };
    }
    user.statut = statut;
    await this.utilisateurRepository.save(user);
    return { message: `Statut modifié vers ${statut}`, utilisateur: user };
  }
  async chnageRole(id: number, role: Role) {
    const user = await this.FindUserById(id);
    if (!user) {
      return {
        erreur: 'Utilisateur inconnu',
      };
    }
    user.role = role;
    await this.utilisateurRepository.save(user);
    return { message: `Role modifié vers ${role}`, utilisateur: user };
  }
  async searchUsers(query: string) {
    const qb = this.utilisateurRepository.createQueryBuilder('user');

    if (query) {
      qb.where('user.prenom ILIKE :q', { q: `%${query}%` })
        .orWhere('user.nom ILIKE :q', { q: `%${query}%` })
        .orWhere('user.email ILIKE :q', { q: `%${query}%` })
        .orWhere('user.role ILIKE :q', { q: `%${query}%` });
    }
    return qb.getMany();
  }
 // utilisateur.service.ts
async update(id: number, updateUtilisateurDto: UpdateUtilisateurDto) {
  // Vérifier si l'utilisateur existe
  const utilisateur = await this.utilisateurRepository.findOne({ 
    where: { id } 
  });
  
  if (!utilisateur) {
    return {
      success: false,
      message: `Utilisateur avec l'ID ${id} non trouvé`
    };
  }

  // Mettre à jour les champs
  if (updateUtilisateurDto.prenom) utilisateur.prenom = updateUtilisateurDto.prenom;
  if (updateUtilisateurDto.nom) utilisateur.nom = updateUtilisateurDto.nom;
  if (updateUtilisateurDto.email) utilisateur.email = updateUtilisateurDto.email;
  if (updateUtilisateurDto.telephone) utilisateur.telephone = updateUtilisateurDto.telephone;
  if (updateUtilisateurDto.photo_profil) utilisateur.photo_profil = updateUtilisateurDto.photo_profil;
  
  // Si mot de passe fourni, le hacher
  if (updateUtilisateurDto.mot_de_passe) {
    const bcrypt = require('bcrypt');
    utilisateur.mot_de_passe = await bcrypt.hash(updateUtilisateurDto.mot_de_passe, 10);
  }
  
  utilisateur.date_modification = new Date();

  // Sauvegarder
  await this.utilisateurRepository.save(utilisateur);

  // Retourner une réponse JSON
  return {
    success: true,
    message: `Utilisateur ${utilisateur.prenom} ${utilisateur.nom} modifié avec succès`,
    utilisateur: {
      id: utilisateur.id,
      prenom: utilisateur.prenom,
      nom: utilisateur.nom,
      email: utilisateur.email,
      role: utilisateur.role,
      statut: utilisateur.statut
    }
  };
}
// utilisateur.service.ts
async remove(id: number) {
  // Vérifier si l'utilisateur existe
  const utilisateur = await this.utilisateurRepository.findOne({ 
    where: { id } 
  });
  
  if (!utilisateur) {
    return {
      success: false,
      message: `Utilisateur avec l'ID ${id} non trouvé`
    };
  }

  // Sauvegarder les infos pour le message
  const nomUtilisateur = `${utilisateur.prenom} ${utilisateur.nom}`;
  
  // Supprimer l'utilisateur
  await this.utilisateurRepository.remove(utilisateur);

  // Retourner une réponse JSON
  return {
    success: true,
    message: `Utilisateur "${nomUtilisateur}" supprimé avec succès`,
    userId: id
  };
}
  async findEnquetesByUser(userId: number) {
    return this.enqueteRepo.find({
      where: { user: { id: userId } },
      order: { createAt: 'DESC' },
    });
  }
  async findEnqueteAvecStatutBrouillonByUser(userId: number) {
    return this.enqueteRepo.find({
      where: { user: { id: userId }, statut: StatusEnquete.Brouillon },
      order: { createAt: 'DESC' },
    });
  }
  async findEnqueteAvecStatutFermeByUser(userId: number) {
    return this.enqueteRepo.find({
      where: { user: { id: userId }, statut: StatusEnquete.Fermee },
      order: { createAt: 'DESC' },
    });
  }
  async findEnqueteAvecStatutPublieeByUser(userId: number) {
    return this.enqueteRepo.find({
      where: { user: { id: userId }, statut: StatusEnquete.Publiee },
      order: { createAt: 'DESC' },
    });
  }
  async findNumberEnquetesByUser(userId: number): Promise<number> {
    return this.enqueteRepo.count({
      where: { user: { id: userId } },
    });
  }
  async findEnquetesByUserDetailles(userId: number, enqueteId: number) {
    const enquete = await this.enqueteRepo.findOne({
      where: {
        id: enqueteId,
        user: { id: userId },
      },
      relations: ['questions', 'questions.options'],
      order: { createAt: 'DESC' },
    });

    if (!enquete) {
      throw new Error('Enquête non trouvée');
    }

    return {
      ...enquete,
      nombreQuestions: enquete.questions ? enquete.questions.length : 0,
    };
  }

  async countallUsersRoleConnecte() {
    return this.utilisateurRepository.count({
      where: {
        role: Role.USER_CONNECTE,
      },
    });
  }
  async countallUsersRoleConnecteNouveau() {
    return this.utilisateurRepository.count({
      where: {
        role: Role.USER_CONNECTE,
      },
    });
  }
  async getAllUsersRoleConnecte() {
    const users = await this.utilisateurRepository.query(`
    SELECT u.*, 
           MAX(r."dateReponse") AS derniere_activite,
           COUNT(r.id) FILTER (WHERE r."dateReponse" IS NOT NULL) AS total_repondues,
           COUNT(r.id) FILTER (WHERE r."dateReponse" IS NULL) AS total_en_attente
    FROM utilisateur u
    LEFT JOIN reponse r ON r.utilisateur_id = u.id
    WHERE u.role = 'ROLE_USER_CONNECTE'
    GROUP BY u.id
  `);

    return {
      message: users.length
        ? 'voici liste des utilisateurs'
        : 'aucun utilisateur trouvée',
      data: users,
    };
  }
  //api pour transfert liste des des users connecte en excel
 async exportUtilisateursConnecte() {
 // console.log("EXPORT API CALLED ✅");

  // Récupérer les utilisateurs connectés
  const { data: users } = await this.getAllUsersRoleConnecte();

  // Création du workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');

  // Définition des colonnes
  worksheet.columns = [
    { header: 'Nom', key: 'nom', width: 20 },
    { header: 'Prénom', key: 'prenom', width: 20 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Statut', key: 'statut', width: 15 },
    { header: 'Réponses', key: 'total_repondues', width: 15 },
    { header: 'Dernière activité', key: 'derniere_activite', width: 25 },
  ];

  // Style pour l'entête
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF6A0DAD' }, // violet purpre
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // Ajouter les données
  users.forEach((user) => {
    worksheet.addRow({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      statut: user.est_verifie ? 'ACTIF' : 'INACTIF',
      total_repondues: user.total_repondues ?? 0,
      derniere_activite: user.derniere_activite
        ? new Date(user.derniere_activite).toLocaleDateString()
        : '-',
    });
  });

  // Style pour toutes les cellules (bordures + centrage)
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      if (rowNumber !== 1) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
    });
  });

  // Ajustement width safe
  worksheet.columns.forEach((col) => {
    col.width = (col.width ?? 15) * 1.2; // width safe
  });

  return workbook;
}
//pour exporter en pdf 
  //api pour les nouvelles users
  async getAllUsersNouveaux() {
    const deuxdernierJours = new Date();
    deuxdernierJours.setDate(deuxdernierJours.getDate() - 2);
    return this.utilisateurRepository.count({
      where: { 
        role: Role.USER_CONNECTE,
        date_creation: MoreThan(deuxdernierJours),
      },
    });
  }
  //nombre de reponse par jour et par utilsateur
  async nombreReponseMoyParJours(date: Date): Promise<number> {
    // début et fin de la journée
    const debut = new Date(date);
    debut.setHours(0, 0, 0, 0);

    const fin = new Date(date);
    fin.setHours(23, 59, 59, 999);

    // récupérer toutes les réponses de la journée
    const reponses = await this.reponseRepo.find({
      where: { dateReponse: Between(debut, fin) },
      relations: ['utilisateur'],
    });
    if (!reponses || reponses.length === 0) return 0;

    // créer map userId => nombre de réponses
    const userMap = new Map<number, number>();

    reponses.forEach((r) => {
      const userId = r.utilisateur.id;
      console.log(userId);
      if (typeof userId === 'number' && !isNaN(userId)) {
        userMap.set(userId, (userMap.get(userId) || 0) + 1);
      }
    });
    const totalRep = reponses.length;
    const totalUsers = userMap.size;

    return totalUsers > 0 ? totalRep / totalUsers : 0;
  }
   async exportPDF(users: any[]): Promise<Buffer> {
    const doc = new jsPDF();

    // Titre principal
    doc.setFontSize(16);
    doc.setTextColor(109, 16, 173); // violet
    doc.text('Liste des utilisateurs', 14, 20);

    // Date d'export
    const date = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Exporté le : ${date}`, 150, 20);

    // Colonnes et données
    const columns = ['Nom', 'Prénom', 'Email', 'Statut', 'Réponses', 'Dernière activité'];
    const rows = users.map(u => [
      u.nom,
      u.prenom,
      u.email,
      u.est_verifie ? 'ACTIF' : 'INACTIF',
      u.total_repondues ?? 0,
      u.derniere_activite ? new Date(u.derniere_activite).toLocaleDateString() : '-',
    ]);

    // Génération de la table
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30, // commencer après le titre
      theme: 'striped', // lignes alternées
      headStyles: {
        fillColor: [109, 16, 173], // violet purpre
        textColor: 255,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 10,
        textColor: 50,
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Nom
        1: { cellWidth: 30 }, // Prénom
        2: { cellWidth: 50 }, // Email
        3: { cellWidth: 20, halign: 'center' }, // Statut
        4: { cellWidth: 20, halign: 'center' }, // Réponses
        5: { cellWidth: 35 }, // Dernière activité
      },
      styles: { font: 'helvetica' },
      margin: { left: 14, right: 14 },
    });

    // Retourner le PDF sous forme de Buffer
const arrayBuffer = doc.output('arraybuffer');
return Buffer.from(arrayBuffer); // ← Conversion correcte
  }
 async exportCSV(): Promise<string> {
    const { data: utilisateurs } = await this.getAllUsersRoleConnecte();

    const fields = ['nom', 'prenom', 'email', 'statut', 'total_repondues', 'derniere_activite'];
    const data = utilisateurs.map(u => ({
      nom: u.nom,
      prenom: u.prenom,
      email: u.email,
      statut: u.est_verifie ? 'ACTIF' : 'INACTIF',
      total_repondues: u.total_repondues ?? 0,
      derniere_activite:     u.derniere_activite ? new Date(u.derniere_activite).toLocaleDateString() : '-',
    }));

    const parser = new Parser({ fields });
    return parser.parse(data);
  }
  async consulterProfil(userId:number){
    const utilisateur= await this.utilisateurRepository.findOne({where:{id:userId}});
    if(!utilisateur){
      return {
        erreur:"user pas connecté"
      }
    }
    return {
      message: "Voici les détails de votre profil",
      profil:utilisateur
    } 

  }
async modifierProfil(userId:number,userModifier:UpdateUtilisateurDto){
  const user=await this.utilisateurRepository.findOne({where:{id:userId}});
  if(!user){
    return {
      erreur:"Utilisateur pas trouvé"
    }
  }
  user.prenom=userModifier.prenom 
  user.nom=userModifier.nom
  user.email=userModifier.email
  user.telephone=userModifier.telephone
  user.photo_profil=userModifier.photo_profil
  user.mot_de_passe=userModifier.mot_de_passe
  user.date_modification=new Date()
 /* this.utilisateurRepository.update({id:userId},{
    prenom:user.prenom,
    nom:user.nom,
    email:user.email, 
    telephone:user.telephone,
    photo_profil:user.photo_profil,
    mot_de_passe:user.mot_de_passe
  })*/

   this.utilisateurRepository.save(user);
  return {
    message:"Profil modifié avec succès"
  };
}
async countAllUsers(){
  const nombreUsersTotal = await this.utilisateurRepository.count();

  return { nombreUsersTotal: nombreUsersTotal };
}
async countAllUsersActifs(){
  const nombresUsersActifs=await this.utilisateurRepository.count({
    where:{
      statut:Status.ACTIF
    }
  })
  return{
    NombreUsersActifs:nombresUsersActifs
  }
}
async countAllUsersInActifs(){
  const nombresUsersInActifs=await this.utilisateurRepository.count({
    where:{
      statut:Status.INACTIF
    }
  })
  return{
    NombreUsersInActifs:nombresUsersInActifs
  }
}
async getNomreAdmins(){
  const nombreAdmins=await this.utilisateurRepository.count(
    {
      where:{
        role:Role.ADMIN
      }
    }
  )
  return{
    NombreAdmins:nombreAdmins
  }
}
}