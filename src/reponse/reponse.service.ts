// reponse.service.ts - Version corrigée complète
import { Injectable } from '@nestjs/common';
import { CreateReponseDto } from './dto/create-reponse.dto';
import { UpdateReponseDto } from './dto/update-reponse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enquete } from 'src/enquete/entities/enquete.entity';
import { Repository } from 'typeorm';
import { Reponse } from './entities/reponse.entity';
import * as ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Parser } from 'json2csv';
import { StatusEnquete } from 'src/enquete/entities/status.enum';

@Injectable()
export class ReponseService {
  constructor(
    @InjectRepository(Reponse) private ReponseRepo: Repository<Reponse>,
    @InjectRepository(Enquete) private enqueteRepository: Repository<Enquete>,
  ) {}

  create(createReponseDto: CreateReponseDto) {
    return 'This action adds a new reponse';
  }

  findAll() {
    return `This action returns all reponse`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reponse`;
  }

  update(id: number, updateReponseDto: UpdateReponseDto) {
    return `This action updates a #${id} reponse`;
  }

  remove(id: number) {
    return `This action removes a #${id} reponse`;
  }

  async getReponsesByAdmin(adminId: number) {
    return await this.enqueteRepository.find({
      where: { user: { id: adminId } },
      relations: ['reponses', 'reponses.utilisateur', 'reponses.question'],
    });
  }

  async getallReponses(userId: number) {
    const listResponses = await this.ReponseRepo.query(
      `
      SELECT DISTINCT ON (u.id)
        u.id AS user_id,
        u.nom,
        u.prenom,
        u.email,
        u.photo_profil,
        u.date_creation,
        r.id AS reponse_id,
        r."reponseTexte",
        r."dateReponse",
        r."enquete_id",
        e.titre,
        e.statut,
        e."dateFin"

      FROM "reponse" r
      JOIN "utilisateur" u ON u.id = r.utilisateur_id
      JOIN "enquete" e ON e.id = r."enquete_id"
      WHERE r."reponseTexte" IS NOT NULL
        AND TRIM(r."reponseTexte") <> ''
        AND e."userId" = $1 

      ORDER BY u.id, LENGTH(r."reponseTexte") DESC; 
      `,
      [userId],
    );

    if (listResponses.length === 0) {
      return {
        msg: 'Aucune réponse trouvée',
        data: [],
      };
    }

    return {
      msg: 'Voici la réponse la plus longue par utilisateur',
      data: listResponses,
    };
  }

  async countAllReponses(userId: number) {
    const enquetes = await this.getReponsesByAdmin(userId);
    let totalReponses = 0;

    for (const enquete of enquetes) {
      totalReponses += enquete.reponses?.length || 0;
    }

    return {
      totalReponses,
      nombreEnquetes: enquetes.length,
    };
  }

  async getAllReponsesDetail(reponseId: number) {
    const reponses = await this.ReponseRepo.query(
      `
      SELECT
        r.id AS reponse_id,
        r."reponseTexte",
        r."dateReponse",
        r.utilisateur_id,
        r.question_id,
        r.enquete_id,
        u.nom,
        u.prenom,
        u.email,
        u.photo_profil,
        u.date_creation,
        q.texte AS question,
        q.type AS type,
        e.titre AS titre_enquete,
        e.statut
      FROM "reponse" r
      JOIN "utilisateur" u ON u.id = r.utilisateur_id
      JOIN "question" q ON q.id = r.question_id
      JOIN "enquete" e ON e.id = r.enquete_id
      WHERE r.utilisateur_id = (
        SELECT utilisateur_id FROM "reponse" WHERE id = $1
      )
        AND r.enquete_id = (
        SELECT enquete_id FROM "reponse" WHERE id = $1
      )
      ORDER BY r."dateReponse" ASC
      `,
      [reponseId],
    );

    if (!reponses.length) {
      return { msg: 'Aucune réponse trouvée', data: [] };
    }

    type UserResponse = {
      user_id: number;
      nom: string;
      prenom: string;
      email: string;
      photo_profil: string | null;
      date_creation: string;
      titre_enquete: string;
      statut: string;
      reponses: { question: string; reponse: string; type: string }[];
    };

    const mapUser = new Map<number, UserResponse>();

    for (const r of reponses) {
      if (!mapUser.has(r.utilisateur_id)) {
        mapUser.set(r.utilisateur_id, {
          user_id: r.utilisateur_id,
          nom: r.nom,
          prenom: r.prenom,
          email: r.email,
          photo_profil: r.photo_profil,
          date_creation: r.date_creation,
          titre_enquete: r.titre_enquete,
          statut: r.statut,
          reponses: [],
        });
      }

      mapUser.get(r.utilisateur_id)?.reponses.push({
        question: r.question,
        reponse: r.reponseTexte,
        type: r.type,
      });
    }

    const grouped: UserResponse[] = Array.from(mapUser.values());

    return {
      msg: 'Voici toutes les réponses par utilisateur avec détails',
      data: grouped,
    };
  }

  async getStatsParEnquete(userId: number) {
    const enquetes = await this.enqueteRepository.find({
      where: { user: { id: userId } },
      relations: ['reponses', 'questions'],
    });

    const stats = enquetes.map((enquete) => ({
      id: enquete.id,
      titre: enquete.titre,
      statut: enquete.statut,
      dateFin: enquete.dateFin,
      totalReponses: enquete.reponses?.length || 0,
      totalQuestions: enquete.questions?.length || 0,
      tauxCompletude:
        enquete.reponses?.length > 0
          ? Math.round(
              (enquete.reponses.length / (enquete.questions?.length || 1)) *
                100,
            )
          : 0,
    }));

    return stats;
  }

  async getTopUtilisateurs(userId: number, limit: number = 5) {
    const topUsers = await this.ReponseRepo.query(
      `
      SELECT 
        u.id,
        u.nom,
        u.prenom,
        u.email,
        COUNT(r.id) as nombre_reponses
      FROM "utilisateur" u
      JOIN "reponse" r ON u.id = r.utilisateur_id
      JOIN "enquete" e ON e.id = r.enquete_id
      WHERE e."userId" = $1
      GROUP BY u.id, u.nom, u.prenom, u.email
      ORDER BY nombre_reponses DESC
      LIMIT $2
      `,
      [userId, limit],
    );

    return topUsers;
  }

  async getTauxCompletionGlobal(userId: number) {
    const result = await this.ReponseRepo.query(
      `
      SELECT 
        COUNT(DISTINCT r.utilisateur_id) as repondants,
        COUNT(DISTINCT u.id) as total_utilisateurs
      FROM "enquete" e
      LEFT JOIN "reponse" r ON e.id = r.enquete_id
      CROSS JOIN (
        SELECT DISTINCT u.id 
        FROM "utilisateur" u
        WHERE u.role IN ('ROLE_USER_CONNECTE', 'ROLE_USER_ANONYME')
      ) u
      WHERE e."userId" = $1
      `,
      [userId],
    );

    const repondants = parseInt(result[0]?.repondants) || 0;
    const total = parseInt(result[0]?.total_utilisateurs) || 1;
    const taux = Math.round((repondants / total) * 100);

    return { taux, repondants, total };
  }

  async getParticipationParPeriode(
    userId: number,
    periode: string = 'semaine',
  ) {
    let groupBy = '';
    let dateFormat = '';

    switch (periode) {
      case 'semaine':
        groupBy = 'EXTRACT(DOW FROM r."dateReponse")';
        dateFormat = 'DAY';
        break;
      case 'mois':
        groupBy = 'EXTRACT(DAY FROM r."dateReponse")';
        dateFormat = 'DAY';
        break;
      default:
        groupBy = 'EXTRACT(DOW FROM r."dateReponse")';
        dateFormat = 'DAY';
    }

    const participation = await this.ReponseRepo.query(
      `
      SELECT 
        ${groupBy} as periode,
        COUNT(*) as nombre
      FROM "reponse" r
      JOIN "enquete" e ON e.id = r.enquete_id
      WHERE e."userId" = $1
      GROUP BY ${groupBy}
      ORDER BY periode
      `,
      [userId],
    );

    return participation;
  }

  // Nouvelle méthode pour l'évolution des réponses par période
  async getEvolutionReponses(userId: number, periode: string = 'week') {
    let dateCondition = '';
    let groupBy = '';

    const now = new Date();

    switch (periode) {
      case 'today':
        dateCondition = `r."dateReponse" >= CURRENT_DATE`;
        groupBy = `EXTRACT(HOUR FROM r."dateReponse")`;
        break;
      case 'week':
        dateCondition = `r."dateReponse" >= CURRENT_DATE - INTERVAL '7 days'`;
        groupBy = `EXTRACT(DOW FROM r."dateReponse")`;
        break;
      case 'month':
        dateCondition = `r."dateReponse" >= CURRENT_DATE - INTERVAL '30 days'`;
        groupBy = `EXTRACT(DAY FROM r."dateReponse")`;
        break;
      case 'year':
        dateCondition = `r."dateReponse" >= CURRENT_DATE - INTERVAL '365 days'`;
        groupBy = `EXTRACT(MONTH FROM r."dateReponse")`;
        break;
      default:
        dateCondition = `r."dateReponse" >= CURRENT_DATE - INTERVAL '7 days'`;
        groupBy = `EXTRACT(DOW FROM r."dateReponse")`;
    }

    const evolution = await this.ReponseRepo.query(
      `
      SELECT 
        ${groupBy} as periode,
        COUNT(*) as nombre,
        DATE_TRUNC('day', r."dateReponse") as date_reponse
      FROM "reponse" r
      JOIN "enquete" e ON e.id = r.enquete_id
      WHERE e."userId" = $1 AND ${dateCondition}
      GROUP BY ${groupBy}, DATE_TRUNC('day', r."dateReponse")
      ORDER BY periode
      `,
      [userId],
    );

    // Calculer le taux de réponse total
    const tauxResult = await this.getTauxCompletionGlobal(userId);

    return {
      evolution: evolution,
      totalReponses: evolution.reduce(
        (sum, item) => sum + parseInt(item.nombre),
        0,
      ),
      tauxReponse: tauxResult.taux,
    };
  }

  // Nouvelle méthode pour les statistiques des enquêtes par statut
  async getSurveyStatusStats(userId: number) {
    const enquetes = await this.enqueteRepository.find({
      where: { user: { id: userId } },
    });

    const total = enquetes.length;
    const actives = enquetes.filter((e) => e.statut === StatusEnquete.archive).length;
    const brouillons = enquetes.filter((e) => e.statut === StatusEnquete.Brouillon).length;
    const terminees = enquetes.filter((e) => e.statut === StatusEnquete.Terminée).length;

    return {
      actives: total > 0 ? Math.round((actives / total) * 100) : 0,
      brouillons: total > 0 ? Math.round((brouillons / total) * 100) : 0,
      terminees: total > 0 ? Math.round((terminees / total) * 100) : 0,
      total,
    };
  }

  // Nouvelle méthode pour la participation par enquête
  async getParticipationParEnquete(userId: number) {
    const enquetes = await this.enqueteRepository.find({
      where: { user: { id: userId } },
      relations: ['reponses'],
    });

    const colors = [
      '#9D50BB',
      '#2ecc71',
      '#3498db',
      '#f39c12',
      '#e74c3c',
      '#1abc9c',
      '#e84393',
    ];

    const participation = enquetes.map((enquete, index) => {
      const totalReponses = enquete.reponses?.length || 0;
      const maxReponses = 100; // Vous pouvez ajuster cette valeur selon votre logique métier
      const value = Math.min(
        Math.round((totalReponses / maxReponses) * 100),
        100,
      );

      return {
        label:
          enquete.titre.length > 20
            ? enquete.titre.substring(0, 20) + '...'
            : enquete.titre,
        value: value,
        color: colors[index % colors.length],
      };
    });

    return participation;
  }

  // Nouvelle méthode pour les top enquêtes
  async getTopEnquetes(
    userId: number,
    periode: string = 'week',
    limit: number = 5,
  ) {
    let dateCondition = '';

    switch (periode) {
      case 'today':
        dateCondition = `r."dateReponse" >= CURRENT_DATE`;
        break;
      case 'week':
        dateCondition = `r."dateReponse" >= CURRENT_DATE - INTERVAL '7 days'`;
        break;
      case 'month':
        dateCondition = `r."dateReponse" >= CURRENT_DATE - INTERVAL '30 days'`;
        break;
      case 'year':
        dateCondition = `r."dateReponse" >= CURRENT_DATE - INTERVAL '365 days'`;
        break;
      default:
        dateCondition = `r."dateReponse" >= CURRENT_DATE - INTERVAL '7 days'`;
    }

    const topEnquetes = await this.ReponseRepo.query(
      `
      SELECT 
        e.id,
        e.titre,
        COUNT(r.id) as nombre_reponses
      FROM "enquete" e
      LEFT JOIN "reponse" r ON e.id = r.enquete_id AND ${dateCondition}
      WHERE e."userId" = $1
      GROUP BY e.id, e.titre
      ORDER BY nombre_reponses DESC
      LIMIT $2
      `,
      [userId, limit],
    );

    return topEnquetes.map((enquete) => ({
      nom:
        enquete.titre.length > 25
          ? enquete.titre.substring(0, 25) + '...'
          : enquete.titre,
      valeur: `${enquete.nombre_reponses} réponses`,
    }));
  }

  // Nouvelle méthode pour les enquêtes récentes
  async getRecentEnquetes(userId: number, limit: number = 3) {
    const recentEnquetes = await this.enqueteRepository.find({
      where: { user: { id: userId } },
      relations: ['reponses'],
      order: { createAt: 'DESC' },
      take: limit,
    });

    return recentEnquetes.map((enquete) => ({
      id: enquete.id,
      titre: enquete.titre,
      participants: enquete.reponses?.length || 0,
      dateFin: enquete.dateFin
        ? new Date(enquete.dateFin).toLocaleDateString('fr-FR')
        : 'Non définie',
      statut:
        enquete.statut === StatusEnquete.Publiee          ? 'Active'
          : enquete.statut === StatusEnquete.Brouillon
            ? 'Brouillon'
            : 'Terminée',
    }));
  }

  // Nouvelle méthode pour les activités récentes
  async getRecentActivities(userId: number, limit: number = 5) {
    const activities = await this.ReponseRepo.query(
      `
      SELECT 
        r."dateReponse" as date,
        u.nom,
        u.prenom,
        e.titre as enquete_titre,
        r."reponseTexte"
      FROM "reponse" r
      JOIN "utilisateur" u ON u.id = r.utilisateur_id
      JOIN "enquete" e ON e.id = r.enquete_id
      WHERE e."userId" = $1
      ORDER BY r."dateReponse" DESC
      LIMIT $2
      `,
      [userId, limit],
    );

    const types = [
      'Nouvelle réponse',
      'Participation',
      'Feedback',
      'Réponse soumise',
      'Enquête complétée',
    ];
    const icons = [
      'fa-reply',
      'fa-user-check',
      'fa-comment',
      'fa-paper-plane',
      'fa-check-circle',
    ];
    const backgrounds = [
      '#9D50BB20',
      '#2ecc7120',
      '#3498db20',
      '#f39c1220',
      '#e74c3c20',
    ];

    return activities.map((activity, index) => ({
      message: `${activity.prenom} ${activity.nom} a répondu à l'enquête "${activity.enquete_titre}"`,
      time: this.getTimeAgo(new Date(activity.date)),
      type: types[index % types.length],
      icon: icons[index % icons.length],
      background: backgrounds[index % backgrounds.length],
    }));
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) return `il y a ${diffMins} min`;
    if (diffHours < 24) return `il y a ${diffHours} h`;
    return `il y a ${diffDays} j`;
  }

  // Export méthodes existantes...
  async exportExcel(userId: number) {
    const response = await this.getallReponses(userId);
    const reponses = response.data;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reponses');

    worksheet.columns = [
      { header: 'Nom', key: 'nom', width: 20 },
      { header: 'Prénom', key: 'prenom', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Réponse', key: 'reponseTexte', width: 30 },
      { header: 'Date Réponse', key: 'dateReponse', width: 25 },
      { header: 'Titre Enquête', key: 'titre', width: 30 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6A0DAD' },
      };
      cell.alignment = { horizontal: 'center' };
    });

    reponses.forEach((reponse) => {
      worksheet.addRow({
        nom: reponse.nom ?? '',
        prenom: reponse.prenom ?? '',
        email: reponse.email ?? '',
        reponseTexte: reponse.reponseTexte ?? '',
        dateReponse: reponse.dateReponse
          ? new Date(reponse.dateReponse).toLocaleString()
          : '',
        titre: reponse.titre ?? '',
      });
    });

    return workbook;
  }

  async exportPDFReponses(userId: number): Promise<Buffer> {
    const response = await this.getallReponses(userId);
    const reponses = response.data;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setTextColor(109, 16, 173);
    doc.text('Liste des réponses', 14, 20);

    const date = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Exporté le : ${date}`, 140, 20);

    const columns = ['Nom', 'Prénom', 'Email', 'Réponse', 'Date', 'Enquête'];
    const rows = reponses.map((r) => [
      r.nom,
      r.prenom,
      r.email,
      r.reponseTexte,
      r.dateReponse ? new Date(r.dateReponse).toLocaleDateString() : '-',
      r.titre,
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
      bodyStyles: {
        fontSize: 10,
        textColor: 50,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 45 },
        3: { cellWidth: 40 },
        4: { cellWidth: 25 },
        5: { cellWidth: 35 },
      },
      styles: { font: 'helvetica' },
      margin: { left: 14, right: 14 },
    });

    const arrayBuffer = doc.output('arraybuffer');
    return Buffer.from(arrayBuffer);
  }

  async exportCSV(userId: number): Promise<string> {
    const response = await this.getallReponses(userId);
    const reponses = response.data;

    const fields = [
      { label: 'Nom', value: 'nom' },
      { label: 'Prénom', value: 'prenom' },
      { label: 'Email', value: 'email' },
      { label: 'Réponse', value: 'reponseTexte' },
      { label: 'Date Réponse', value: 'dateReponse' },
      { label: 'Titre Enquête', value: 'titre' },
    ];

    const data = reponses.map((r) => ({
      nom: r.nom ?? '',
      prenom: r.prenom ?? '',
      email: r.email ?? '',
      reponseTexte: r.reponseTexte ?? '',
      dateReponse: r.dateReponse
        ? new Date(r.dateReponse).toLocaleString()
        : '',
      titre: r.titre ?? '',
    }));

    const parser = new Parser({ fields });
    return parser.parse(data);
  }
}
