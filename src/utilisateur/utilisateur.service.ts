// utilisateur.service.ts
import { Injectable, Param } from '@nestjs/common';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { Utilisateur } from './entities/utilisateur.entity';
import { Between, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './status.enum';
import { Enquete } from 'src/enquete/entities/enquete.entity';
import { StatusEnquete } from 'src/enquete/entities/status.enum';
import { Reponse } from 'src/reponse/entities/reponse.entity';
import * as ExcelJS from 'exceljs';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { Role } from 'src/role/entities/role.entity';
import { Parser } from 'json2csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
    @InjectRepository(Enquete) private enqueteRepo: Repository<Enquete>,
    @InjectRepository(Reponse) private reponseRepo: Repository<Reponse>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Message)   private messagesRepo:   Repository<Message>,    // ← ajouter
  ) {}

  // ================================================================
  // CREATE
  // ================================================================
  async create(
    createUtilisateurDto: CreateUtilisateurDto,
    file?: Express.Multer.File,
  ) {
    const { prenom, nom, email, mot_de_passe, telephone } =
      createUtilisateurDto;

    // ── Validation ──────────────────────────────────────────────────
    if (!prenom?.trim()) return { erreur: 'Le prenom est obligatoire' };
    if (!nom?.trim()) return { erreur: 'Le nom est obligatoire' };
    if (!email?.trim()) return { erreur: "L'email est obligatoire" };
    if (!mot_de_passe?.trim())
      return { erreur: 'Le mot de passe est obligatoire' };

    if (!email.includes('@')) return { erreur: "L'email doit contenir @" };
    if (!email.includes('.')) return { erreur: "L'email doit contenir ." };
    if (email.indexOf('@') === 0)
      return { erreur: "L'email doit contenir des caractères avant @" };
    if (email.lastIndexOf('.') === email.length - 1)
      return { erreur: "L'email doit contenir des caractères après ." };

    if (mot_de_passe.length < 8)
      return {
        erreur: 'Le mot de passe doit contenir au moins 8 caractères',
      };
    if (!/[A-Z]/.test(mot_de_passe))
      return {
        erreur: 'Le mot de passe doit contenir au moins une majuscule',
      };
    if (!/[0-9]/.test(mot_de_passe))
      return { erreur: 'Le mot de passe doit contenir au moins un chiffre' };
    if (!/[@$!%*?&]/.test(mot_de_passe))
      return {
        erreur:
          'Le mot de passe doit contenir au moins un caractère spécial',
      };

    // ── Email existant ───────────────────────────────────────────────
    const exist = await this.utilisateurRepository.findOne({
      where: { email },
    });
    if (exist) return { erreur: "L'email existe déjà" };

    // ── Photo profil ─────────────────────────────────────────────────
    let photo_profil: string | undefined = undefined;
    if (file) photo_profil = `/uploads/profiles/${file.filename}`;

    // ── Hash password ────────────────────────────────────────────────
    const mot_de_passe_hache = await bcrypt.hash(mot_de_passe, 10);

    // ── Token vérification ───────────────────────────────────────────
    const token = crypto.randomBytes(16).toString('hex');
    const token_expiration = new Date(Date.now() + 5 * 60 * 1000);

    // ── Rôle par défaut ──────────────────────────────────────────────
    let defaultRole = await this.roleRepo.findOne({
      where: { nom: 'USER_CONNECTE' },
    });
    if (!defaultRole) {
      defaultRole = this.roleRepo.create({
        nom: 'USER_CONNECTE',
        description: 'Utilisateur connecté standard',
      });
      await this.roleRepo.save(defaultRole);
    }

    // ── Création utilisateur ─────────────────────────────────────────
    const utilisateur = this.utilisateurRepository.create({
      prenom,
      nom,
      email,
      mot_de_passe: mot_de_passe_hache,
      code_verification: token,
      token_expiration,
      statut: Status.INACTIF,
      photo_profil,
      telephone,
      role: defaultRole,
    });

    await this.utilisateurRepository.save(utilisateur);

    // ── Email de vérification ────────────────────────────────────────
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
      console.error('Erreur email:', error);
    }

    return { message: 'Utilisateur créé avec succès', photo_profil };
  }

  // ================================================================
  // VERIFICATION TOKEN
  // ================================================================
  async verificationToken(token: string) {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { code_verification: token },
    });
    if (!utilisateur) return { erreur: 'Token de vérification invalide' };
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

  // ================================================================
  // GET ALL USERS
  // ✅ CORRECTION : Ajouter relations: ['role'] pour avoir user.role
  // ================================================================
  async getAllusers() {
    return this.utilisateurRepository.find({
      relations: ['role'],
      select: {
        id: true,
        prenom: true,
        nom: true,
        email: true,
        telephone: true,
        photo_profil: true,
        statut: true,
        est_verifie: true,
        date_creation: true,
        date_modification: true,
        role: {
          id: true,
          nom: true,
          couleur: true,
          actif: true,
        },
      },
      order: { date_creation: 'DESC' },
    });
  }

  // ================================================================
  // FIND USER BY ID
  // ✅ CORRECTION : Ajouter relations: ['role']
  // ================================================================
  async FindUserById(id: number) {
    return this.utilisateurRepository.findOne({
      where: { id },
      relations: ['role'],
      select: {
        id: true,
        prenom: true,
        nom: true,
        email: true,
        telephone: true,
        photo_profil: true,
        statut: true,
        est_verifie: true,
        date_creation: true,
        date_modification: true,
        role: {
          id: true,
          nom: true,
          couleur: true,
          actif: true,
        },
      },
    });
  }

  // ================================================================
  // CHANGE STATUS
  // ================================================================
  async changeStatus(id: number, statut: Status) {
    const user = await this.utilisateurRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) return { erreur: 'Utilisateur inconnu' };
    user.statut = statut;
    await this.utilisateurRepository.save(user);
    return {
      message: `Statut modifié vers ${statut}`,
      utilisateur: {
        id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        statut: user.statut,
        role: user.role?.nom,
      },
    };
  }

  // ================================================================
  // CHANGER ROLE
  // ✅ CORRECTION PRINCIPALE :
  //    - Accepte string (nom), number (id), ou objet Role
  //    - Garde le nom de méthode original : chnageRole
  // ================================================================
  async chnageRole(id: number, roleInput: string | number | Role) {
    const user = await this.utilisateurRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) return { erreur: 'Utilisateur inconnu' };

    let roleEntity: Role | null = null;

    // ── Cas 1 : Objet Role avec id ───────────────────────────────────
    if (
      typeof roleInput === 'object' &&
      roleInput !== null &&
      (roleInput as Role).id
    ) {
      roleEntity = await this.roleRepo.findOne({
        where: { id: (roleInput as Role).id },
      });
    }
    // ── Cas 2 : Nombre (id du rôle) ──────────────────────────────────
    else if (typeof roleInput === 'number') {
      roleEntity = await this.roleRepo.findOne({
        where: { id: roleInput },
      });
    }
    // ── Cas 3 : String numérique (ex: "2") ───────────────────────────
    else if (typeof roleInput === 'string' && !isNaN(Number(roleInput))) {
      roleEntity = await this.roleRepo.findOne({
        where: { id: Number(roleInput) },
      });
    }
    // ── Cas 4 : String nom du rôle (ex: 'ADMIN', 'USER_CONNECTE') ────
    else if (typeof roleInput === 'string') {
      roleEntity = await this.roleRepo.findOne({
        where: { nom: roleInput },
      });
    }

    if (!roleEntity) {
      return { erreur: `Rôle "${roleInput}" introuvable` };
    }

    user.role = roleEntity;
    await this.utilisateurRepository.save(user);

    return {
      message: `Rôle modifié vers "${roleEntity.nom}"`,
      utilisateur: {
        id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        role: roleEntity.nom,
        statut: user.statut,
      },
    };
  }

  // ================================================================
  // SEARCH USERS
  // ================================================================
  async searchUsers(query: string) {
    const qb = this.utilisateurRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    if (query) {
      qb.where('user.prenom ILIKE :q', { q: `%${query}%` })
        .orWhere('user.nom ILIKE :q', { q: `%${query}%` })
        .orWhere('user.email ILIKE :q', { q: `%${query}%` })
        .orWhere('user.telephone ILIKE :q', { q: `%${query}%` });
    }

    return qb.getMany();
  }

  // ================================================================
  // UPDATE
  // ================================================================
  async update(id: number, updateUtilisateurDto: UpdateUtilisateurDto) {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!utilisateur) {
      return {
        success: false,
        message: `Utilisateur avec l'ID ${id} non trouvé`,
      };
    }

    if (updateUtilisateurDto.prenom)
      utilisateur.prenom = updateUtilisateurDto.prenom;
    if (updateUtilisateurDto.nom) utilisateur.nom = updateUtilisateurDto.nom;
    if (updateUtilisateurDto.email)
      utilisateur.email = updateUtilisateurDto.email;
    if (updateUtilisateurDto.telephone)
      utilisateur.telephone = updateUtilisateurDto.telephone;
    if (updateUtilisateurDto.photo_profil)
      utilisateur.photo_profil = updateUtilisateurDto.photo_profil;
    if (updateUtilisateurDto.mot_de_passe) {
      utilisateur.mot_de_passe = await bcrypt.hash(
        updateUtilisateurDto.mot_de_passe,
        10,
      );
    }

    utilisateur.date_modification = new Date();
    await this.utilisateurRepository.save(utilisateur);

    return {
      success: true,
      message: `Utilisateur ${utilisateur.prenom} ${utilisateur.nom} modifié avec succès`,
      utilisateur: {
        id: utilisateur.id,
        prenom: utilisateur.prenom,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role?.nom,
        statut: utilisateur.statut,
      },
    };
  }

  // ================================================================
  // REMOVE
  // ================================================================
  async remove(id: number) {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id },
    });
    if (!utilisateur) {
      return {
        success: false,
        message: `Utilisateur avec l'ID ${id} non trouvé`,
      };
    }
    const nomUtilisateur = `${utilisateur.prenom} ${utilisateur.nom}`;
    await this.utilisateurRepository.remove(utilisateur);
    return {
      success: true,
      message: `Utilisateur "${nomUtilisateur}" supprimé avec succès`,
      userId: id,
    };
  }

  // ================================================================
  // ENQUETES PAR USER
  // ================================================================
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
    return this.enqueteRepo.count({ where: { user: { id: userId } } });
  }

  async findEnquetesByUserDetailles(userId: number, enqueteId: number) {
    const enquete = await this.enqueteRepo.findOne({
      where: { id: enqueteId, user: { id: userId } },
      relations: ['questions', 'questions.options'],
      order: { createAt: 'DESC' },
    });
    if (!enquete) throw new Error('Enquête non trouvée');
    return {
      ...enquete,
      nombreQuestions: enquete.questions ? enquete.questions.length : 0,
    };
  }

  // ================================================================
  // USERS ROLE CONNECTE
  // ================================================================
  async countallUsersRoleConnecte() {
    const userRole = await this.roleRepo.findOne({
      where: { nom: 'USER_CONNECTE' },
    });
    if (!userRole) return 0;
    return this.utilisateurRepository.count({
      where: { role: { id: userRole.id } },
    });
  }

  async countallUsersRoleConnecteNouveau() {
    const userRole = await this.roleRepo.findOne({
      where: { nom: 'USER_CONNECTE' },
    });
    if (!userRole) return 0;
    return this.utilisateurRepository.count({
      where: { role: { id: userRole.id } },
    });
  }

  async getAllUsersRoleConnecte() {
    const userRole = await this.roleRepo.findOne({
      where: { nom: 'USER_CONNECTE' },
    });
    if (!userRole) {
      return { message: 'aucun utilisateur trouvé', data: [] };
    }

    const users = await this.utilisateurRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'role')
      .leftJoin('reponse', 'r', 'r.utilisateur_id = u.id')
      .where('role.id = :roleId', { roleId: userRole.id })
      .addSelect('MAX(r.dateReponse)', 'derniere_activite')
      .addSelect(
        'COUNT(CASE WHEN r.dateReponse IS NOT NULL THEN r.id END)',
        'total_repondues',
      )
      .addSelect(
        'COUNT(CASE WHEN r.dateReponse IS NULL THEN r.id END)',
        'total_en_attente',
      )
      .groupBy('u.id, role.id')
      .getRawAndEntities();

    const formatted = users.entities.map((entity, idx) => ({
      ...entity,
      derniere_activite: users.raw[idx]?.derniere_activite || null,
      total_repondues: parseInt(
        users.raw[idx]?.total_repondues || '0',
        10,
      ),
      total_en_attente: parseInt(
        users.raw[idx]?.total_en_attente || '0',
        10,
      ),
    }));

    return {
      message: formatted.length
        ? 'voici liste des utilisateurs'
        : 'aucun utilisateur trouvée',
      data: formatted,
    };
  }

  // ================================================================
  // EXPORT EXCEL
  // ================================================================
  async exportUtilisateursConnecte() {
    const { data: users } = await this.getAllUsersRoleConnecte();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = [
      { header: 'Nom', key: 'nom', width: 20 },
      { header: 'Prénom', key: 'prenom', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Statut', key: 'statut', width: 15 },
      { header: 'Réponses', key: 'total_repondues', width: 15 },
      { header: 'Dernière activité', key: 'derniere_activite', width: 25 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6A0DAD' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

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

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (rowNumber !== 1)
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    worksheet.columns.forEach((col) => {
      col.width = (col.width ?? 15) * 1.2;
    });

    return workbook;
  }

  // ================================================================
  // NOUVEAUX USERS
  // ================================================================
  async getAllUsersNouveaux() {
    const deuxdernierJours = new Date();
    deuxdernierJours.setDate(deuxdernierJours.getDate() - 2);
    const userRole = await this.roleRepo.findOne({
      where: { nom: 'USER_CONNECTE' },
    });
    if (!userRole) return 0;
    return this.utilisateurRepository.count({
      where: {
        role: { id: userRole.id },
        date_creation: MoreThan(deuxdernierJours),
      },
    });
  }

  // ================================================================
  // MOYENNE REPONSES PAR JOUR
  // ================================================================
  async nombreReponseMoyParJours(date: Date): Promise<number> {
    const debut = new Date(date);
    debut.setHours(0, 0, 0, 0);
    const fin = new Date(date);
    fin.setHours(23, 59, 59, 999);

    const reponses = await this.reponseRepo.find({
      where: { dateReponse: Between(debut, fin) },
      relations: ['utilisateur'],
    });

    if (!reponses.length) return 0;

    const userMap = new Map<number, number>();
    reponses.forEach((r) => {
      const userId = r.utilisateur.id;
      if (typeof userId === 'number' && !isNaN(userId)) {
        userMap.set(userId, (userMap.get(userId) || 0) + 1);
      }
    });

    return reponses.length / userMap.size;
  }

  // ================================================================
  // EXPORT PDF
  // ================================================================
  async exportPDF(users: any[]): Promise<Buffer> {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(109, 16, 173);
    doc.text('Liste des utilisateurs', 14, 20);

    const date = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Exporté le : ${date}`, 150, 20);

    const columns = [
      'Nom',
      'Prénom',
      'Email',
      'Statut',
      'Réponses',
      'Dernière activité',
    ];
    const rows = users.map((u) => [
      u.nom,
      u.prenom,
      u.email,
      u.est_verifie ? 'ACTIF' : 'INACTIF',
      u.total_repondues ?? 0,
      u.derniere_activite
        ? new Date(u.derniere_activite).toLocaleDateString()
        : '-',
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: 'striped',
      headStyles: {
        fillColor: [109, 16, 173],
        textColor: 255,
        fontStyle: 'bold',
      },
      bodyStyles: { fontSize: 10, textColor: 50, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { cellWidth: 50 },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 35 },
      },
      margin: { left: 14, right: 14 },
    });

    const arrayBuffer = doc.output('arraybuffer');
    return Buffer.from(arrayBuffer);
  }

  // ================================================================
  // EXPORT CSV
  // ================================================================
  async exportCSV(): Promise<string> {
    const { data: utilisateurs } = await this.getAllUsersRoleConnecte();
    const fields = [
      'nom',
      'prenom',
      'email',
      'statut',
      'total_repondues',
      'derniere_activite',
    ];
    const data = utilisateurs.map((u) => ({
      nom: u.nom,
      prenom: u.prenom,
      email: u.email,
      statut: u.est_verifie ? 'ACTIF' : 'INACTIF',
      total_repondues: u.total_repondues ?? 0,
      derniere_activite: u.derniere_activite
        ? new Date(u.derniere_activite).toLocaleDateString()
        : '-',
    }));
    const parser = new Parser({ fields });
    return parser.parse(data);
  }

  // ================================================================
  // PROFIL
  // ================================================================
  async consulterProfil(userId: number) {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    if (!utilisateur) return { erreur: 'user pas connecté' };
    const { mot_de_passe, ...safeUser } = utilisateur;
    return { message: 'Voici les détails de votre profil', profil: safeUser };
  }

  async modifierProfil(userId: number, userModifier: UpdateUtilisateurDto) {
    const user = await this.utilisateurRepository.findOne({
      where: { id: userId },
    });
    if (!user) return { erreur: 'Utilisateur pas trouvé' };

    if (userModifier.prenom) user.prenom = userModifier.prenom;
    if (userModifier.nom) user.nom = userModifier.nom;
    if (userModifier.email) user.email = userModifier.email;
    if (userModifier.telephone) user.telephone = userModifier.telephone;
    if (userModifier.photo_profil)
      user.photo_profil = userModifier.photo_profil;
    if (userModifier.mot_de_passe) {
      user.mot_de_passe = await bcrypt.hash(userModifier.mot_de_passe, 10);
    }

    user.date_modification = new Date();
    await this.utilisateurRepository.save(user);
    return { message: 'Profil modifié avec succès' };
  }

  // ================================================================
  // STATISTIQUES
  // ================================================================
  async countAllUsers() {
    const nombreUsersTotal = await this.utilisateurRepository.count();
    return { nombreUsersTotal };
  }

  async countAllUsersActifs() {
    const nombresUsersActifs = await this.utilisateurRepository.count({
      where: { statut: Status.ACTIF },
    });
    return { NombreUsersActifs: nombresUsersActifs };
  }

  async countAllUsersInActifs() {
    const nombresUsersInActifs = await this.utilisateurRepository.count({
      where: { statut: Status.INACTIF },
    });
    return { NombreUsersInActifs: nombresUsersInActifs };
  }

  async getNomreAdmins() {
    const adminRole = await this.roleRepo.findOne({
      where: { nom: 'ADMIN' },
    });
    if (!adminRole) return { NombreAdmins: 0 };
    const nombreAdmins = await this.utilisateurRepository.count({
      where: { role: { id: adminRole.id } },
    });
    return { NombreAdmins: nombreAdmins };
  }
  async updateWithPhoto(id: number, dto: UpdateUtilisateurDto, file?: Express.Multer.File, removePhoto = false) {
  const user = await this.utilisateurRepository.findOne({ where: { id } });
  if (!user) return { success: false, message: 'Utilisateur non trouvé' };

  if (dto.prenom) user.prenom = dto.prenom;
  if (dto.nom) user.nom = dto.nom;
  if (dto.email) user.email = dto.email;
  if (dto.telephone) user.telephone = dto.telephone;

 // Dans updateWithPhoto, assigner null (ou undefined mais null est mieux)
if (removePhoto) {
  user.photo_profil = null;
}else if (file) {
    user.photo_profil = `/uploads/profiles/${file.filename}`;
  }

  user.date_modification = new Date();
  await this.utilisateurRepository.save(user);
  return { success: true, message: 'Utilisateur mis à jour', utilisateur: user };
}
// ================================================================
// STATISTIQUES COMPLÈTES PAR USER
// ================================================================
async getStatsUser(userId: number) {
  const user = await this.utilisateurRepository.findOne({
    where: { id: userId },
    relations: ['role'],
  });
  if (!user) return { erreur: 'Utilisateur introuvable' };

  // ── Enquêtes ──────────────────────────────────────────────────────
  const [totalEnquetes, enquetesBrouillon, enquetesPubliees, enquetesFermees, toutesLesEnquetes] =
    await Promise.all([
      this.enqueteRepo.count({ where: { user: { id: userId } } }),
      this.enqueteRepo.count({ where: { user: { id: userId }, statut: StatusEnquete.Brouillon } }),
      this.enqueteRepo.count({ where: { user: { id: userId }, statut: StatusEnquete.Publiee } }),
      this.enqueteRepo.count({ where: { user: { id: userId }, statut: StatusEnquete.Fermee } }),
      this.enqueteRepo.find({
        where: { user: { id: userId } },
        relations: ['questions', 'questions.options'],
        order: { createAt: 'DESC' },
      }),
    ]);

  // ── Réclamations (CORRIGÉ: avec guillemets pour la casse mixte) ──
  const reclamations = await this.utilisateurRepository.manager.query(
    `SELECT id, titre, description, statut, "createdAt", "resoluLe", "typeDommage", "totalSeverite", gravite, "coutEstime"
     FROM reclamation 
     WHERE "userId" = $1 
     ORDER BY "createdAt" DESC`,
    [userId],
  );
  
  const totalReclamations = reclamations.length;
  const reclamationsResolues = reclamations.filter((r: any) => r.statut === 'RESOLU').length;
  const derniereReclamation = reclamations[0]?.createdAt ?? null;

  // ── Réponses détaillées par enquête ───────────────────────────────
  const reponses = await this.reponseRepo.find({
    where: { utilisateur: { id: userId } },
    relations: ['enquete', 'question', 'question.options'],
    order: { dateReponse: 'DESC' },
  });
  
  const totalReponses = reponses.length;
  const derniereReponse = reponses[0]?.dateReponse ?? null;

  // Grouper les réponses par enquête
  const reponsesParEnquete = new Map();
  reponses.forEach(reponse => {
    if (!reponse.enquete) return;
    
    const enqueteId = reponse.enquete.id;
    if (!reponsesParEnquete.has(enqueteId)) {
      reponsesParEnquete.set(enqueteId, {
        enquete: {
          id: reponse.enquete.id,
          titre: reponse.enquete.titre,
          description: reponse.enquete.description,
          statut: reponse.enquete.statut,
          dateCreation: reponse.enquete.createAt,
        },
        reponses: [],
        dateDerniereReponse: reponse.dateReponse,
        totalReponses: 0
      });
    }
    
    const enqueteData = reponsesParEnquete.get(enqueteId);
    enqueteData.reponses.push({
      id: reponse.id,
      questionId: reponse.question?.id,
      questionTexte: reponse.question?.texte,
      reponseTexte: reponse.reponseTexte,
      dateReponse: reponse.dateReponse,
      typeQuestion: reponse.question?.type,
    });
    enqueteData.totalReponses++;
    if (reponse.dateReponse > enqueteData.dateDerniereReponse) {
      enqueteData.dateDerniereReponse = reponse.dateReponse;
    }
  });

  // Taux de complétion
  const enquetesAvecReponse = reponsesParEnquete.size;
  const tauxCompletion = enquetesPubliees > 0 
    ? Math.round((enquetesAvecReponse / enquetesPubliees) * 100) 
    : 0;

  // ── Messages détaillés ───────────────────────────────────────────
  const messagesRecusDetails = await this.utilisateurRepository.manager.query(
    `SELECT m.*, u.prenom as expediteur_prenom, u.nom as expediteur_nom, u.email as expediteur_email
     FROM messages m
     LEFT JOIN utilisateur u ON u.id = m.expediteur_id
     WHERE m.destinataire_id = $1 
     ORDER BY m.date_envoi DESC`,
    [userId],
  );

  const messagesEnvoyesDetails = await this.utilisateurRepository.manager.query(
    `SELECT m.*, u.prenom as destinataire_prenom, u.nom as destinataire_nom, u.email as destinataire_email
     FROM messages m
     LEFT JOIN utilisateur u ON u.id = m.destinataire_id
     WHERE m.expediteur_id = $1 
     ORDER BY m.date_envoi DESC`,
    [userId],
  );

  const messagesNonLus = messagesRecusDetails.filter((m: any) => !m.lu);
  const dernierMessage = messagesRecusDetails[0] || messagesEnvoyesDetails[0];
  
  const messagesRecus = messagesRecusDetails.length;
  const messagesEnvoyes = messagesEnvoyesDetails.length;

  // ── Dernière activité ────────────────────────────────────────────
  const dates = [derniereReponse, derniereReclamation, dernierMessage?.date_envoi]
    .filter(Boolean)
    .map(d => new Date(d));

  const derniereActivite = dates.length > 0 
    ? new Date(Math.max(...dates.map(d => d.getTime()))) 
    : null;

  // ── Statistiques supplémentaires ─────────────────────────────────
  const statsParMois = await this.getUserMonthlyStats(userId);
  const questionsRepondues = reponses.length;

  return {
    userId,
    utilisateur: {
      id: user.id,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      role: user.role?.nom,
      statut: user.statut,
      telephone: user.telephone,
      date_creation: user.date_creation,
    },
    
    // Enquêtes détaillées
    enquetes: {
      statistiques: {
        total: totalEnquetes,
        brouillon: enquetesBrouillon,
        publiees: enquetesPubliees,
        fermees: enquetesFermees,
      },
      liste: toutesLesEnquetes.map(enquete => ({
        id: enquete.id,
        titre: enquete.titre,
        description: enquete.description,
        statut: enquete.statut,
        dateCreation: enquete.createAt,
        nombreQuestions: enquete.questions?.length || 0,
        nombreReponsesRecues: reponsesParEnquete.get(enquete.id)?.totalReponses || 0,
        dernierReponse: reponsesParEnquete.get(enquete.id)?.dateDerniereReponse || null,
        questions: enquete.questions?.map(q => ({
          id: q.id,
          texte: q.texte,
          type: q.type,
          options: q.options?.map(opt => opt.texte) || [],
        })),
      })),
    },

    // Réponses détaillées
    reponses: {
      statistiques: {
        total: totalReponses,
        taux_completion: tauxCompletion,
        questions_repondues: questionsRepondues,
        enquetes_participees: enquetesAvecReponse,
        derniere: derniereReponse,
      },
      par_enquete: Array.from(reponsesParEnquete.entries()).map(([enqueteId, data]) => ({
        enquete: data.enquete,
        reponses: data.reponses,
        totalReponses: data.totalReponses,
      })),
      details: reponses.map(r => ({
        id: r.id,
        enquete: {
          id: r.enquete?.id,
          titre: r.enquete?.titre,
        },
        question: {
          id: r.question?.id,
          texte: r.question?.texte,
          type: r.question?.type,
        },
        reponse: {
          texte: r.reponseTexte,
        },
        date: r.dateReponse,
      })),
    },

    // Réclamations détaillées
    reclamations: {
      statistiques: {
        total: totalReclamations,
        resolues: reclamationsResolues,
        en_attente: totalReclamations - reclamationsResolues,
        taux_resolution: totalReclamations > 0 
          ? Math.round((reclamationsResolues / totalReclamations) * 100) 
          : 0,
        derniere: derniereReclamation,
      },
      liste: reclamations.map((r: any) => ({
        id: r.id,
        titre: r.titre,
        description: r.description,
        statut: r.statut,
        typeDommage: r.typeDommage,
        totalSeverite: r.totalSeverite,
        gravite: r.gravite,
        coutEstime: r.coutEstime,
        dateCreation: r.createdAt,
        dateResolution: r.resoluLe,
        delaiResolution: r.resoluLe 
          ? Math.ceil((new Date(r.resoluLe).getTime() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24))
          : null,
      })),
    },

    // Messages détaillés
    messages: {
      statistiques: {
        recus: messagesRecus,
        envoyes: messagesEnvoyes,
        non_lus: messagesNonLus.length,
        taux_lecture: messagesRecus > 0 
          ? Math.round(((messagesRecus - messagesNonLus.length) / messagesRecus) * 100) 
          : 0,
        derniere: dernierMessage?.date_envoi || null,
      },
      recus: messagesRecusDetails.map((m: any) => ({
        id: m.id,
        contenu: m.contenu,
        lu: m.lu,
        dateEnvoi: m.date_envoi,
        expediteur: {
          id: m.expediteur_id,
          nom: `${m.expediteur_prenom} ${m.expediteur_nom}`,
          email: m.expediteur_email,
        },
      })),
      envoyes: messagesEnvoyesDetails.map((m: any) => ({
        id: m.id,
        contenu: m.contenu,
        lu: m.lu,
        dateEnvoi: m.date_envoi,
        destinataire: {
          id: m.destinataire_id,
          nom: `${m.destinataire_prenom} ${m.destinataire_nom}`,
          email: m.destinataire_email,
        },
      })),
    },

    // Statistiques mensuelles
    statistiques_mensuelles: statsParMois,

    // Activité globale
    derniere_activite: derniereActivite,
    
    // Niveau d'engagement
    engagement: {
      score: this.calculateEngagementScore({
        totalReponses,
        totalReclamations,
        messagesRecus,
        messagesEnvoyes,
        jours_activite: this.getActiveDaysCount(dates),
      }),
      niveau: this.getEngagementLevel({
        totalReponses,
        totalReclamations,
        messagesRecus,
        messagesEnvoyes,
      }),
    },
  };
}

// ================================================================
// MÉTHODES AUXILIAIRES POUR LES STATISTIQUES
// ================================================================

private async getUserMonthlyStats(userId: number) {
  try {
    const monthlyStats = await this.reponseRepo
      .createQueryBuilder('reponse')
      .select("DATE_TRUNC('month', reponse.dateReponse) as mois")
      .addSelect('COUNT(*) as total_reponses')
      .where('reponse.utilisateur_id = :userId', { userId })
      .groupBy("DATE_TRUNC('month', reponse.dateReponse)")
      .orderBy('mois', 'DESC')
      .limit(6)
      .getRawMany();

    const monthlyMessages = await this.utilisateurRepository.manager.query(
      `SELECT DATE_TRUNC('month', date_envoi) as mois, COUNT(*) as total_messages
       FROM messages 
       WHERE expediteur_id = $1 OR destinataire_id = $1
       GROUP BY DATE_TRUNC('month', date_envoi)
       ORDER BY mois DESC
       LIMIT 6`,
      [userId],
    );

    return {
      reponses_par_mois: monthlyStats,
      messages_par_mois: monthlyMessages,
    };
  } catch (error) {
    console.error('Erreur lors du calcul des stats mensuelles:', error);
    return {
      reponses_par_mois: [],
      messages_par_mois: [],
    };
  }
}

private calculateEngagementScore(stats: any): number {
  let score = 0;
  score += Math.min(stats.totalReponses * 5, 50);
  score += Math.min(stats.totalReclamations * 10, 30);
  score += Math.min((stats.messagesRecus + stats.messagesEnvoyes) * 2, 20);
  score += Math.min(stats.jours_activite * 5, 20);
  return Math.min(score, 100);
}

private getEngagementLevel(stats: any): string {
  const total = (stats.totalReponses || 0) + 
                (stats.totalReclamations || 0) + 
                (stats.messagesRecus || 0) + 
                (stats.messagesEnvoyes || 0);
  
  if (total > 100) return 'TRES_ACTIF';
  if (total > 50) return 'ACTIF';
  if (total > 10) return 'MODERE';
  return 'NOUVEAU';
}

private getActiveDaysCount(dates: Date[]): number {
  const uniqueDays = new Set();
  dates.forEach(date => {
    if (date) {
      uniqueDays.add(date.toDateString());
    }
  });
  return uniqueDays.size;
}
// ================================================================
// STATISTIQUES POUR GRAPHIQUE UTILISATEURS
// ================================================================

/**
 * Récupérer les données d'évolution des utilisateurs pour le graphique
 * @param periode - 'week', 'month', 'year'
 * @returns Données formatées pour le graphique
 */
async getUserEvolutionData(periode: string = 'month'): Promise<{
  labels: string[];
  newUsers: number[];
  activeUsers: number[];
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsersRate: number;
}> {
  try {
    const now = new Date();
    let labels: string[] = [];
    let newUsersData: number[] = [];
    let activeUsersData: number[] = [];

    // Récupérer tous les utilisateurs avec leurs dates de création et dernières activités
    const allUsers = await this.utilisateurRepository.find({
      relations: ['role'],
    });

    // Compter le nombre total d'utilisateurs
    const totalUsers = allUsers.length;

    // Compter les nouveaux utilisateurs de ce mois
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = allUsers.filter(
      u => new Date(u.date_creation) >= startOfMonth
    ).length;

    // Calculer le taux d'utilisateurs actifs (qui ont une activité récente)
    const activeThreshold = new Date();
    activeThreshold.setDate(activeThreshold.getDate() - 30); // 30 jours d'activité
    const activeUsers = allUsers.filter(
      u => u.date_modification && new Date(u.date_modification) >= activeThreshold
    ).length;
    const activeUsersRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

    switch (periode) {
      case 'week':
        // Données pour les 7 derniers jours
        labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);

          // Nouveaux utilisateurs du jour
          const newCount = allUsers.filter(u => {
            const creationDate = new Date(u.date_creation);
            return creationDate >= date && creationDate < nextDate;
          }).length;
          newUsersData.push(newCount);

          // Utilisateurs actifs du jour (qui ont eu une activité ce jour-là)
          const activeCount = allUsers.filter(u => {
            const modifDate = new Date(u.date_modification);
            return modifDate >= date && modifDate < nextDate;
          }).length;
          activeUsersData.push(activeCount);
        }
        break;

      case 'month':
        // Données pour les 4 dernières semaines
        labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
        for (let i = 3; i >= 0; i--) {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - (i * 7 + 7));
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 7);

          const newCount = allUsers.filter(u => {
            const creationDate = new Date(u.date_creation);
            return creationDate >= startDate && creationDate < endDate;
          }).length;
          newUsersData.push(newCount);

          const activeCount = allUsers.filter(u => {
            const modifDate = new Date(u.date_modification);
            return modifDate >= startDate && modifDate < endDate;
          }).length;
          activeUsersData.push(activeCount);
        }
        break;

      case 'year':
        // Données pour les 12 derniers mois
        labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        for (let i = 0; i < 12; i++) {
          const startDate = new Date(now.getFullYear(), i, 1);
          const endDate = new Date(now.getFullYear(), i + 1, 1);

          const newCount = allUsers.filter(u => {
            const creationDate = new Date(u.date_creation);
            return creationDate >= startDate && creationDate < endDate;
          }).length;
          newUsersData.push(newCount);

          const activeCount = allUsers.filter(u => {
            const modifDate = new Date(u.date_modification);
            return modifDate >= startDate && modifDate < endDate;
          }).length;
          activeUsersData.push(activeCount);
        }
        break;

      default:
        // Par défaut: données mensuelles
        labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
        newUsersData = [12, 18, 15, 23];
        activeUsersData = [45, 52, 48, 58];
    }

    return {
      labels,
      newUsers: newUsersData,
      activeUsers: activeUsersData,
      totalUsers,
      newUsersThisMonth,
      activeUsersRate,
    };
  } catch (error) {
    console.error('Erreur getUserEvolutionData:', error);
    // Retourner des données par défaut en cas d'erreur
    return {
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      newUsers: [12, 18, 15, 23],
      activeUsers: [45, 52, 48, 58],
      totalUsers: 0,
      newUsersThisMonth: 0,
      activeUsersRate: 0,
    };
  }
}

/**
 * Récupérer les statistiques simplifiées pour les cartes du dashboard
 */
async getDashboardUserStats(): Promise<{
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsersRate: number;
}> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const activeThreshold = new Date();
    activeThreshold.setDate(activeThreshold.getDate() - 30);

    const [totalUsers, newUsersThisMonth, activeUsers] = await Promise.all([
      this.utilisateurRepository.count(),
      this.utilisateurRepository.count({
        where: { date_creation: Between(startOfMonth, now) },
      }),
      this.utilisateurRepository.count({
        where: { date_modification: Between(activeThreshold, now) },
      }),
    ]);

    const activeUsersRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

    return {
      totalUsers,
      newUsersThisMonth,
      activeUsersRate,
    };
  } catch (error) {
    console.error('Erreur getDashboardUserStats:', error);
    return { totalUsers: 0, newUsersThisMonth: 0, activeUsersRate: 0 };
  }
}
async getMesClients(AdminId:number){
  const req = await this.utilisateurRepository.query(`
  SELECT DISTINCT 
    u.id,
    u.prenom,
    u.nom,
    u.email,
    u.telephone,
    u.photo_profil,
    e.id AS enquete_id,
    e.titre
FROM utilisateur u
JOIN reponse r ON u.id = r.utilisateur_id
JOIN enquete e ON r.enquete_id = e.id
WHERE e."userId" = ${AdminId}
ORDER BY e.id, u.prenom;
  `)
  if(req.length===0){
    return {message:"Aucun client trouvé pour cet admin", data:[]}
  }
  else{
    return {message:"Voici la liste de vos clients", data:req}
  }
}
}