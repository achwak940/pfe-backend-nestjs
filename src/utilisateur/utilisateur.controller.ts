// utilisateur.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import express from 'express';
import { Status } from './status.enum';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

// ✅ CORRECTION : Suppression import Role inutile dans le controller
// ✅ CORRECTION : Import express unifié (plus d'import express_1 et express séparés)
// ✅ CORRECTION : extname depuis 'path' (pas 'path/win32')

@Controller('utilisateur')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  // ================================================================
  // ✅ ROUTES STATIQUES - Doivent être AVANT les routes avec :id
  // ================================================================

  // ── Statistiques ─────────────────────────────────────────────────
  @Get('/NombreUsers')
  async getNombreUsers() {
    return this.utilisateurService.countAllUsers();
  }

  @Get('/NombreUsers/actifs')
  async getNombreUsersActifs() {
    return this.utilisateurService.countAllUsersActifs();
  }

  @Get('/NombreUsers/Inactifs')
  async getNombreUsersInActifs() {
    return this.utilisateurService.countAllUsersInActifs();
  }

  @Get('/Nombre/Admins')
  async getNombreAdmins() {
    return this.utilisateurService.getNomreAdmins();
  }

  @Get('/count/all')
  async CountAllUsers() {
    return this.utilisateurService.countallUsersRoleConnecte();
  }

  // ── Exports ───────────────────────────────────────────────────────
  @Get('/export-csv')
  async exportCSV(@Res() res: express.Response) {
    const csv = await this.utilisateurService.exportCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=users_connecte.csv',
    );
    res.send(csv);
  }

  @Get('export-connecte')
  async exportUtilisateursConnecte(@Res() res: express.Response) {
    try {
      const fileExcel =
        await this.utilisateurService.exportUtilisateursConnecte();
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=users_connecte.xlsx',
      );
      await fileExcel.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('EXPORT ERROR ❌', error);
      res.status(500).send('Erreur export');
    }
  }

  @Get('exportPdf-connecte')
  async exportPdf(@Res() res: express.Response) {
    const { data: users } =
      await this.utilisateurService.getAllUsersRoleConnecte();
    const pdfBuffer = await this.utilisateurService.exportPDF(users);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="users_connecte.pdf"',
    );
    res.setHeader('Content-Length', pdfBuffer.length.toString());
    res.end(pdfBuffer);
  }

  // ── Listes ────────────────────────────────────────────────────────
  @Get('/get/all')
  findAll() {
    return this.utilisateurService.getAllusers();
  }

  @Get('get/all/connecte')
  async getAllconnecte() {
    return this.utilisateurService.getAllUsersRoleConnecte();
  }

  @Get('get/all/connecte/nouveaux')
  async getAllconnecteNouveaux() {
    return this.utilisateurService.getAllUsersNouveaux();
  }

  // ── Recherche ─────────────────────────────────────────────────────
  @Get('/search')
  filtrageUsers(@Query('query') query: string) {
    return this.utilisateurService.searchUsers(query);
  }

  // ── Vérification token ───────────────────────────────────────────
  @Get('/verification')
  verificationToken(@Query('token') token: string) {
    if (!token) return { erreur: 'Le token est manquant' };
    return this.utilisateurService.verificationToken(token);
  }

  // ── Moyenne réponses ─────────────────────────────────────────────
  @Get('/reponseMoyeneJour')
  async getMoy(@Query('date') datestr: string) {
    const date = datestr ? new Date(datestr) : new Date();
    if (isNaN(date.getTime())) return { message: 'Date invalide', moyenne: 0 };
    const moyenne =
      await this.utilisateurService.nombreReponseMoyParJours(date);
    return { date: date.toDateString(), moyenne };
  }

  // ── Profil ───────────────────────────────────────────────────────
  // ✅ CORRECTION : /profil/:userId AVANT /:id pour éviter conflit
  @Get('/profil/:userId')
  async ConsulterProfil(@Param('userId', ParseIntPipe) userId: number) {
    return this.utilisateurService.consulterProfil(userId);
  }

  @Patch('/profil/:userId')
  async ModifierProfil(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() userModifier: UpdateUtilisateurDto,
  ) {
    return this.utilisateurService.modifierProfil(userId, userModifier);
  }

  // ── Enquêtes (routes statiques avec sous-chemins) ─────────────────
  // ✅ CORRECTION : Ces routes AVANT /enquetes/:id pour éviter conflits
  @Get('/enquetes/count/:id')
  async getNumberEnquetesByUser(@Param('id', ParseIntPipe) id: number) {
    return await this.utilisateurService.findNumberEnquetesByUser(id);
  }

  @Get('/enquetes/brullion/:id')
  async getAllEnqueteStatuBruillon(@Param('id', ParseIntPipe) id: number) {
    const allenqueteBrullion =
      await this.utilisateurService.findEnqueteAvecStatutBrouillonByUser(id);
    if (!allenqueteBrullion || allenqueteBrullion.length === 0)
      return { message: 'Aucune enquête en brullion trouvée', data: [] };
    return {
      message: 'Voici liste des enuqêtes avec le statu brullion',
      data: allenqueteBrullion,
    };
  }

  @Get('/enquetes/ferme/:id')
  async getAllEnqueteFerme(@Param('id', ParseIntPipe) id: number) {
    const listeEnqueteFerme =
      await this.utilisateurService.findEnqueteAvecStatutFermeByUser(id);
    if (!listeEnqueteFerme || listeEnqueteFerme.length === 0)
      return { message: 'Aucune enquête fermée trouvée', data: [] };
    return {
      message: 'Voici liste des enuqêtes avec le statu fermée',
      data: listeEnqueteFerme,
    };
  }

  @Get('/enquetes/publiee/:id')
  async getAllEnquetePubliee(@Param('id', ParseIntPipe) id: number) {
    const allEnquetePublie =
      await this.utilisateurService.findEnqueteAvecStatutPublieeByUser(id);
    if (!allEnquetePublie || allEnquetePublie.length === 0)
      return { message: 'Aucune enquête Publiée trouvée', data: [] };
    return {
      message: 'Voici liste des enuqêtes avec le statu Publiée',
      data: allEnquetePublie,
    };
  }

  @Get('/enquetes/:userId/:enqueteId')
  async getEnqueteDetails(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('enqueteId', ParseIntPipe) enqueteId: number,
  ) {
    return this.utilisateurService.findEnquetesByUserDetailles(
      userId,
      enqueteId,
    );
  }

  @Get('/enquetes/:id')
  findenquetebyuser(@Param('id', ParseIntPipe) id: number) {
    return this.utilisateurService.findEnquetesByUser(id);
  }

  // ── Register ─────────────────────────────────────────────────────
  @Post('/register')
  @UseInterceptors(
    FileInterceptor('photo_profil', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
      // ✅ Filtrer uniquement les images
      fileFilter: (req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
        if (!allowed.test(file.originalname)) {
          return cb(new Error('Seules les images sont autorisées'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    }),
  )
  create(
    @Body() createUtilisateurDto: CreateUtilisateurDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.utilisateurService.create(createUtilisateurDto, file);
  }

  // ================================================================
  // ✅ ROUTES DYNAMIQUES - Toujours EN DERNIER
  // ================================================================

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.utilisateurService.FindUserById(id);
  }

  @Patch(':id/statuts')
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('statut') statut: Status,
  ) {
    return this.utilisateurService.changeStatus(id, statut);
  }

  // ✅ CORRECTION PRINCIPALE : Accepte role comme string (nom) ou number (id)
  @Patch(':id/role')
  changeRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: string | number,
  ) {
    return this.utilisateurService.chnageRole(id, role);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUtilisateurDto: UpdateUtilisateurDto,
  ) {
    return this.utilisateurService.update(id, updateUtilisateurDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.utilisateurService.remove(id);
  }
  // Dans UtilisateurController, après les routes d'export et avant @Get(':id')

@Patch(':id/with-photo')
@UseInterceptors(FileInterceptor('photo_profil', {
  storage: diskStorage({
    destination: './uploads/profiles',
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (!allowed.test(file.originalname)) {
      return cb(new Error('Seules les images sont autorisées'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
}))
async updateWithPhoto(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateDto: UpdateUtilisateurDto,
  @UploadedFile() file?: Express.Multer.File,
  @Body('remove_photo') removePhoto?: string
) {
  return this.utilisateurService.updateWithPhoto(id, updateDto, file, removePhoto === 'true');
}
// Statistiques complètes d'un utilisateur
// GET /utilisateur/:id/stats
@Get(':id/stats')
async getStatsUser(@Param('id', ParseIntPipe) id: number) {
  return this.utilisateurService.getStatsUser(id);
}
// ================================================================
// ROUTES POUR GRAPHIQUE UTILISATEURS (à placer AVANT les routes dynamiques)
// ================================================================

/**
 * Récupérer les données d'évolution des utilisateurs pour le graphique
 * @GET /utilisateur/stats/evolution?periode=month
 */
@Get('stats/evolution')
async getUserEvolutionData(@Query('periode') periode: string = 'month') {
  const data = await this.utilisateurService.getUserEvolutionData(periode);
  return {
    success: true,
    data,
    message: `Données d'évolution des utilisateurs pour la période: ${periode}`,
  };
}

/**
 * Récupérer les statistiques simplifiées pour les cartes du dashboard
 * @GET /utilisateur/stats/dashboard
 */
@Get('stats/dashboard')
async getDashboardUserStats() {
  const stats = await this.utilisateurService.getDashboardUserStats();
  return {
    success: true,
    data: stats,
    message: 'Statistiques utilisateurs pour le dashboard',
  };
}

/**
 * Récupérer le nombre total d'utilisateurs
 * @GET /utilisateur/count/total
 */
@Get('count/total')
async getTotalUsersCount() {
  const total = await this.utilisateurService.countAllUsers();
  return {
    success: true,
    total: total.nombreUsersTotal,
    message: `Nombre total d'utilisateurs: ${total.nombreUsersTotal}`,
  };
}
@Get('clients/:id')
async getMesClients(@Param('id') AdminId: number) {
  const  rep=await this.utilisateurService.getMesClients(AdminId)
  return {
  
    rep
  };
}
}