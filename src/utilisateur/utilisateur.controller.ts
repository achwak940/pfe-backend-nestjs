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
} from '@nestjs/common';
import express from 'express';
import { Status } from './status.enum';
import { Role } from './role.enum';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import express_1 from 'express';
@Controller('utilisateur')
export class UtilisateurController {
    @Get('/NombreUsers')
  async getNombreUsers() {
    return this.utilisateurService.countAllUsers();
  }
  constructor(private readonly utilisateurService: UtilisateurService) {}
  @Get('/export-csv')
  async exportCSV(@Res() res: express_1.Response) {
    const csv = await this.utilisateurService.exportCSV();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=users_connecte.csv',
    );

    res.send(csv);
  }
  @Post('/register')
  create(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return this.utilisateurService.create(createUtilisateurDto);
  }

  @Get('/get/all')
  findAll() {
    return this.utilisateurService.getAllusers();
  }

  @Get('/search')
  filtrageUsers(@Query('query') query: string) {
    return this.utilisateurService.searchUsers(query);
  }

  @Get('/verification')
  verificationToken(@Query('token') token: string) {
    if (!token) return { erreur: 'Le token est manquant' };
    return this.utilisateurService.verificationToken(token);
  }

  // ✅ Routes statiques avant routes dynamiques
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
    // Récupérer les utilisateurs
    const { data: users } =
      await this.utilisateurService.getAllUsersRoleConnecte();

    // Appeler la méthode exportPDF avec l’argument users
    const pdfBuffer = await this.utilisateurService.exportPDF(users);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="users_connecte.pdf"',
    );
    res.setHeader('Content-Length', pdfBuffer.length.toString());
    res.end(pdfBuffer);
  }

  @Get('get/all/connecte')
  async getAllconnecte() {
    return this.utilisateurService.getAllUsersRoleConnecte();
  }

  @Get('get/all/connecte/nouveaux')
  async getAllconnecteNouveaux() {
    return this.utilisateurService.getAllUsersNouveaux();
  }

  @Get('/count/all')
  async CountAllUsers() {
    return this.utilisateurService.countallUsersRoleConnecte();
  }

  // ✅ Routes dynamiques avec :id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.utilisateurService.FindUserById(id);
  }

  @Patch(':id/statuts')
  changeStatus(@Param('id') id: number, @Body('statut') statut: Status) {
    return this.utilisateurService.changeStatus(id, statut);
  }

  @Patch(':id/role')
  changeRole(@Param('id') id: number, @Body('role') role: Role) {
    return this.utilisateurService.chnageRole(id, role);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUtilisateurDto: UpdateUtilisateurDto,
  ) {
    return this.utilisateurService.update(+id, updateUtilisateurDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utilisateurService.remove(+id);
  }

  @Get('/enquetes/:id')
  findenquetebyuser(@Param('id') id: number) {
    return this.utilisateurService.findEnquetesByUser(id);
  }

  @Get('/enquetes/count/:id')
  async getNumberEnquetesByUser(@Param('id') id: number) {
    return await this.utilisateurService.findNumberEnquetesByUser(id);
  }

  @Get('/enquetes/brullion/:id')
  async getAllEnqueteStatuBruillon(@Param('id') id: number) {
    const allenqueteBrullion =
      await this.utilisateurService.findEnqueteAvecStatutBrouillonByUser(id);
    if (!allenqueteBrullion || allenqueteBrullion.length === 0)
      return { message: 'Aucune enquête en brullion trouvée', data: [] };
    return {
      message: 'Voici liste des enuqêtes avec le statu brullion',
      data: [allenqueteBrullion],
    };
  }

  @Get('/enquetes/ferme/:id')
  async getAllEnqueteFerme(@Param('id') id: number) {
    const listeEnqueteFerme =
      await this.utilisateurService.findEnqueteAvecStatutFermeByUser(id);
    if (!listeEnqueteFerme || listeEnqueteFerme.length === 0)
      return { message: 'Aucune enquête fermée trouvée', data: [] };
    return {
      message: 'Voici liste des enuqêtes avec le statu fermée',
      data: listeEnqueteFerme,
    };
  }

  @Get('/all/Publiee')
  async getAllEnquetePubliee(@Param('id') id: number) {
    const allEnquetePublie =
      await this.utilisateurService.findEnqueteAvecStatutPublieeByUser(id);
    if (!allEnquetePublie || allEnquetePublie.length === 0)
      return { message: 'Aucune enquête Publiée trouvée', data: [] };
    return {
      message: 'Voici liste des enuqêtes avec le statu Publiée',
      data: [],
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

  @Get('/reponseMoyeneJour')
  async getMoy(@Query('date') datestr: string) {
    const date = datestr ? new Date(datestr) : new Date();
    if (isNaN(date.getTime())) return { message: 'Date invalide', moyenne: 0 };
    return { date: date.toDateString() };
  }
  @Get('/profil/:userId')
  async ConsulterProfil(
    @Param('userId') userId: number,
    AncienUser: UpdateUtilisateurDto,
  ) {
    return this.utilisateurService.consulterProfil(userId);
  }
  @Patch('/profil/:userId')
  async ModifierProfil(
    @Param('userId') userId: number,
    @Body() userModifier: UpdateUtilisateurDto,
  ) {
    return this.utilisateurService.modifierProfil(userId, userModifier);
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
}
