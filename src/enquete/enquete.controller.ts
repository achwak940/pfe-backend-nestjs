import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Res, Query } from '@nestjs/common';
import { EnqueteService } from './enquete.service';
import { CreateEnqueteDto } from './dto/create-enquete.dto';
import { UpdateEnqueteDto } from './dto/update-enquete.dto';
import { StatusEnquete } from './entities/status.enum';
import { TypeParticipation } from './entities/TypeParticipation.enum';
import type { Response } from 'express';

@Controller('enquete')
export class EnqueteController {
  constructor(private readonly enqueteService: EnqueteService) {}

  // ============================================
  // ROUTES POST
  // ============================================
  
  @Post('/creation')
  create(@Body() createEnqueteDto: CreateEnqueteDto) {
    return this.enqueteService.create(createEnqueteDto);
  }

  @Post('submit/:id')
  async submitEnquete(
    @Param('id') id: string,
    @Body() body: { answers: any[]; reponses?: any[]; userId?: number }
  ) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException('ID invalide');
    }
    
    const answers = body.answers || body.reponses || [];
    
    if (!answers.length) {
      throw new BadRequestException('Aucune réponse à soumettre');
    }

    const normalizedAnswers = answers.map((ans: any) => ({
      questionId: ans.questionId || ans.question_id,
      questionTexte: ans.questionTexte || ans.questionText || ans.question_texte,
      response: ans.response || ans.reponseTexte || ans.reponse_texte,
      type: ans.type,
      isTemp: ans.isTemp || ans.is_temp || false,
    }));

    return this.enqueteService.submitEnquete(idNumber, normalizedAnswers);
  }

  // ============================================
  // ROUTES GET (FIXES - SANS PARAMÈTRES)
  // ============================================

  @Get("/all")
  findAll() {
    return this.enqueteService.findAll();
  }

  @Get("/all/EnBrullion")
  async findAllEnqueteBrullion() {
    const allEnqueteBrullion = await this.enqueteService.getAllenqueteEnBrullion();
    if (!allEnqueteBrullion || allEnqueteBrullion.length === 0) {
      return {
        message: 'Aucune enquête en brouillon trouvée',
        data: []
      };
    }
    return {
      message: 'Voici la liste des enquêtes avec le statut brouillon',
      data: allEnqueteBrullion
    };
  }

  @Get("/all/Ferme")
  async findAllEnqueteFerme() {
    const allEnqueteFerme = await this.enqueteService.getAllEnqueteFerme();
    if (!allEnqueteFerme || allEnqueteFerme.length === 0) {
      return {
        message: 'Aucune enquête ferme trouvée',
        data: []
      };
    }
    return {
      message: 'Voici la liste des enquêtes avec le statut ferme',
      data: allEnqueteFerme
    };
  }

  @Get("/all/Publiee")
  async findallEnquetePubliee() {
    const allEnquetePubliee = await this.enqueteService.getAllEnquetePubliee();
    if (!allEnquetePubliee || allEnquetePubliee.length === 0) {
      return {
        message: "Aucune enquête Publiée trouvée",
        data: []
      };
    }
    return {
      message: "Voici liste des enquêtes avec le statut Publiée",
      data: allEnquetePubliee
    };
  }

  @Get("/all/Archivee")
  async getallEnqueteArchive() {
    const allEnqueteArchive = await this.enqueteService.getAllEnqueteArchive();
    if (!allEnqueteArchive || allEnqueteArchive.length === 0) {
      return {
        message: "Aucune enquête Archivée trouvée",
        data: []
      };
    }
    return {
      message: "Voici liste des enquêtes avec le statut Archivée",
      data: allEnqueteArchive
    };
  }

  // ============================================
  // ROUTES STATISTIQUES (FIXES)
  // ============================================

  @Get('count')
  async getTotalEnquetesCount() {
    const count = await this.enqueteService.getTotalEnquetesCount();
    return {
      success: true,
      total_enquetes: count,
      message: `Nombre total d'enquêtes: ${count}`
    };
  }

  @Get('distribution')
  async getEnqueteDistributionAll() {
    const distribution = await this.enqueteService.getEnqueteDistribution();
    return {
      success: true,
      data: distribution,
      message: `Distribution des ${distribution.total} enquêtes`
    };
  }

  @Get('stats/chart')
  async getEnqueteStatsForChartAll() {
    const stats = await this.enqueteService.getEnqueteStatsForChart();
    return {
      success: true,
      data: stats,
      message: `Total: ${stats.total} enquêtes`
    };
  }

  // ============================================
  // ROUTES AVEC PARAMÈTRES (DOIVENT ÊTRE APRÈS LES ROUTES FIXES)
  // ============================================

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`ID invalide: ${id}`);
    }
    return this.enqueteService.findEnqueteByid(idNumber);
  }

  @Get(':id/stats')
  async getEnqueteStats(@Param('id') id: string) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`ID invalide: ${id}`);
    }
    return this.enqueteService.getEnqueteStats(idNumber);
  }

  @Get(':id/evolution')
  async getEvolutionReponses(@Param('id') id: string) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`ID invalide: ${id}`);
    }
    return this.enqueteService.getEvolutionReponses(idNumber);
  }

  @Get(':id/qrcode')
  async generateQRCode(@Param('id') id: string, @Res() res: Response) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`ID invalide: ${id}`);
    }
    const qrBuffer = await this.enqueteService.generateQRCode(idNumber);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="qrcode_enquete_${id}.png"`);
    res.send(qrBuffer);
  }

  @Get(':id/question/:questionId/reponses')
  async getReponsesByQuestion(
    @Param('id') id: string,
    @Param('questionId') questionId: string
  ) {
    const idNumber = parseInt(id);
    const qIdNumber = parseInt(questionId);
    if (isNaN(idNumber) || isNaN(qIdNumber)) {
      throw new BadRequestException('IDs invalides');
    }
    return this.enqueteService.getReponsesByQuestion(idNumber, qIdNumber);
  }

  @Get('/detailes/:id')
  async getOneWithQuestions(@Param('id') id: string) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`ID invalide: ${id}`);
    }
    return this.enqueteService.getEnqueteByDetailesQuestions(idNumber);
  }

  @Get('/findbyuser/:id')
  async findenquetebyUser(@Param('id') id: string) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`ID invalide: ${id}`);
    }
    return this.enqueteService.findByUser(idNumber);
  }

  // ============================================
  // ROUTES UTILISATEUR
  // ============================================

  @Get('participants/:userId')
  async getNombreuserByAdmin(@Param('userId') userId: string) {
    const idNumber = parseInt(userId);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`UserId invalide: ${userId}`);
    }
    return this.enqueteService.getNombreParticipantByAdmin(idNumber);
  }

  @Get('taux-reponse-admin/:userId')
  async getTauxReponseAdmin(@Param('userId') userId: string) {
    const id = parseInt(userId);
    if (isNaN(id)) {
      throw new BadRequestException('UserId invalide');
    }
    return {
      taux_reponse: await this.enqueteService.getTauxReponseByAdmin(id)
    };
  }

  @Get('taux-participation/total/:adminId')
  async getTotalParticipationRate(@Param('adminId') adminId: string) {
    const id = parseInt(adminId);
    if (isNaN(id)) {
      throw new BadRequestException('AdminId invalide');
    }
    const taux = await this.enqueteService.getTotalParticipationRateByAdmin(id);
    return {
      success: true,
      taux_participation: taux,
      message: `Taux de participation: ${taux}%`
    };
  }

  @Get('distribution/:adminId')
  async getEnqueteDistributionByAdmin(@Param('adminId') adminId: string) {
    const id = parseInt(adminId);
    if (isNaN(id)) {
      throw new BadRequestException('AdminId invalide');
    }
    const distribution = await this.enqueteService.getEnqueteDistribution(id);
    return {
      success: true,
      data: distribution,
      message: `Distribution des ${distribution.total} enquêtes`
    };
  }

  @Get('stats/chart/:adminId')
  async getEnqueteStatsForChartByAdmin(@Param('adminId') adminId: string) {
    const id = parseInt(adminId);
    if (isNaN(id)) {
      throw new BadRequestException('AdminId invalide');
    }
    const stats = await this.enqueteService.getEnqueteStatsForChart(id);
    return {
      success: true,
      data: stats,
      message: `Total: ${stats.total} enquêtes`
    };
  }

  @Get('user/:userId/enquetes')
  async getUserEnquetesWithStatus(
    @Param('userId') userId: string,
    @Query('statut') statut?: string,
    @Query('categorie') categorie?: string
  ) {
    const id = parseInt(userId);
    if (isNaN(id)) {
      throw new BadRequestException('UserId invalide');
    }
    return this.enqueteService.getUserEnquetesWithStatus(id, { statut, categorie });
  }

  @Get('user/:userId/history')
  async getUserResponsesHistory(@Param('userId') userId: string) {
    const id = parseInt(userId);
    if (isNaN(id)) {
      throw new BadRequestException('UserId invalide');
    }
    return this.enqueteService.getUserResponsesHistory(id);
  }

  @Get('user/:userId/enquete/:enqueteId/with-responses')
  async getUserEnqueteWithResponses(
    @Param('userId') userId: string,
    @Param('enqueteId') enqueteId: string
  ) {
    const uid = parseInt(userId);
    const eid = parseInt(enqueteId);
    
    if (isNaN(uid) || isNaN(eid)) {
      throw new BadRequestException('Ids invalides');
    }
    
    return this.enqueteService.getUserEnqueteWithResponses(eid, uid);
  }

  @Get('user/:userId/enquete/:enqueteId/has-responded')
  async hasUserRespondedToEnquete(
    @Param('userId') userId: string,
    @Param('enqueteId') enqueteId: string
  ) {
    const uid = parseInt(userId);
    const eid = parseInt(enqueteId);
    
    if (isNaN(uid) || isNaN(eid)) {
      throw new BadRequestException('Ids invalides');
    }
    
    const hasResponded = await this.enqueteService.hasUserRespondedToEnquete(eid, uid);
    return { hasResponded };
  }

  @Get('user/:userId/responses-count')
  async getUserResponsesCountByEnquete(@Param('userId') userId: string) {
    const id = parseInt(userId);
    if (isNaN(id)) {
      throw new BadRequestException('UserId invalide');
    }
    return this.enqueteService.getUserResponsesCountByEnquete(id);
  }

  // ============================================
  // ROUTES DE PARTAGE
  // ============================================

  @Get(':id/share/links')
  async getShareLinks(@Param('id') id: string, @Query('userId') userId?: string) {
    const enqueteId = parseInt(id);
    if (isNaN(enqueteId)) {
      throw new BadRequestException('ID invalide');
    }
    const userIdNum = userId ? parseInt(userId) : undefined;
    return this.enqueteService.generateShareLinks(enqueteId, userIdNum);
  }

  @Get(':id/share/message')
  async getShareMessage(@Param('id') id: string, @Query('destinataire') destinataire?: string) {
    const enqueteId = parseInt(id);
    if (isNaN(enqueteId)) {
      throw new BadRequestException('ID invalide');
    }
    return this.enqueteService.generateShareMessage(enqueteId, destinataire);
  }

  @Get(':id/share/all')
  async getAllShareInfo(@Param('id') id: string, @Query('userId') userId?: string) {
    const enqueteId = parseInt(id);
    if (isNaN(enqueteId)) {
      throw new BadRequestException('ID invalide');
    }
    const userIdNum = userId ? parseInt(userId) : undefined;
    return this.enqueteService.getAllShareInfo(enqueteId, userIdNum);
  }

  @Get(':id/share/qrcode')
  async getQRCode(@Param('id') id: string, @Res() res: Response) {
    const enqueteId = parseInt(id);
    if (isNaN(enqueteId)) {
      throw new BadRequestException('ID invalide');
    }
    
    const { qrCodeDataUrl } = await this.enqueteService.generateQRCodeForEnquete(enqueteId);
    
    const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="qrcode_enquete_${enqueteId}.png"`);
    res.send(imageBuffer);
  }

  @Get(':id/share/messenger')
  async getMessengerLink(@Param('id') id: string) {
    const enqueteId = parseInt(id);
    if (isNaN(enqueteId)) {
      throw new BadRequestException('ID invalide');
    }
    const url = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/repondre/${enqueteId}`;
    return {
      messengerLink: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=&redirect_uri=${encodeURIComponent(url)}`
    };
  }

  @Get(':id/share/instagram')
  async getInstagramLink(@Param('id') id: string) {
    const enqueteId = parseInt(id);
    if (isNaN(enqueteId)) {
      throw new BadRequestException('ID invalide');
    }
    const url = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/repondre/${enqueteId}`;
    return {
      instagramLink: `https://www.instagram.com/?url=${encodeURIComponent(url)}`,
      instructions: "Copiez ce lien pour le partager sur Instagram: " + url
    };
  }

  // ============================================
  // ROUTES D'ENVOI D'EMAIL (POST)
  // ============================================

  @Post(':id/share/email')
  async sendEnqueteByEmailProfessional(
    @Param('id') id: string,
    @Body() body: { emails: string[]; customMessage?: string }
  ) {
    const enqueteId = parseInt(id);
    if (isNaN(enqueteId)) {
      throw new BadRequestException('ID invalide');
    }
    if (!body.emails || body.emails.length === 0) {
      throw new BadRequestException('Aucun email fourni');
    }
    return this.enqueteService.sendEnqueteByEmailProfessional(enqueteId, body.emails, body.customMessage);
  }

  @Post(':id/share/whatsapp')
  async sendEnqueteByWhatsApp(
    @Param('id') id: string,
    @Body() body: { phoneNumbers: string[]; customMessage?: string }
  ) {
    const enqueteId = parseInt(id);
    if (isNaN(enqueteId)) {
      throw new BadRequestException('ID invalide');
    }
    if (!body.phoneNumbers || body.phoneNumbers.length === 0) {
      throw new BadRequestException('Aucun numéro de téléphone fourni');
    }
    return this.enqueteService.sendEnqueteByWhatsApp(enqueteId, body.phoneNumbers, body.customMessage);
  }

  @Post(':id/send/email')
  async sendEnqueteByEmailWithTemplate(
    @Param('id') id: string,
    @Body() body: { emails: string[]; customMessage?: string }
  ) {
    const enqueteId = parseInt(id);
    if (isNaN(enqueteId)) {
      throw new BadRequestException('ID invalide');
    }
    if (!body.emails || body.emails.length === 0) {
      throw new BadRequestException('Aucun email fourni');
    }
    return this.enqueteService.sendEnqueteByEmailWithTemplate(
      enqueteId,
      body.emails,
      body.customMessage
    );
  }

  @Post(':id/send/users')
  async sendEnqueteToUsers(
    @Param('id') id: string,
    @Body() body: { userIds: number[]; customMessage?: string }
  ) {
    const enqueteId = parseInt(id);
    if (isNaN(enqueteId)) {
      throw new BadRequestException('ID invalide');
    }
    if (!body.userIds || body.userIds.length === 0) {
      throw new BadRequestException('Aucun utilisateur sélectionné');
    }
    return this.enqueteService.sendEnqueteToUsers(
      enqueteId,
      body.userIds,
      body.customMessage
    );
  }

  // ============================================
  // ROUTES PATCH
  // ============================================

  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() updateEnqueteDto: UpdateEnqueteDto) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`ID invalide: ${id}`);
    }
    return this.enqueteService.update(idNumber, updateEnqueteDto);
  }

  @Patch('/change-statut/:id')
  async changeStatut(
    @Param('id') id: string,
    @Body('statut') statut: StatusEnquete
  ) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`ID invalide: ${id}`);
    }
    return this.enqueteService.changeStatut(idNumber, statut);
  }

  @Patch("/changeTypeParticipation/:id")
  async changeTypeParticipation(@Param('id') id: string, @Body('typeParticipation') type: TypeParticipation) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`ID invalide: ${id}`);
    }
    return this.enqueteService.changeTypedeParticipation(idNumber, type);
  }

  @Patch(':id/publier')
  async publishEnquete(@Param('id') id: string) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`ID invalide: ${id}`);
    }
    return this.enqueteService.changeStatut(idNumber, StatusEnquete.Publiee);
  }

  @Patch(':id/archiver')
  async archiveEnquete(@Param('id') id: string) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`ID invalide: ${id}`);
    }
    return this.enqueteService.changeStatut(idNumber, StatusEnquete.archive);
  }

  // ============================================
  // ROUTES DELETE
  // ============================================

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(`ID invalide: ${id}`);
    }
   // return this.enqueteService.remove(idNumber);
  return this.enqueteService.remove(+id)
  }
  // ========== DASHBOARD STATISTICS ==========


@Get('dashboard/survey-status/:adminId')
async getSurveyStatusAdmin(@Param('adminId') adminId: string) {
  const id = parseInt(adminId);
  if (isNaN(id)) throw new BadRequestException('adminId invalide');
  return this.enqueteService.getSurveyStatusStatsByAdmin(id);
}

@Get('dashboard/participation/:adminId')
async getParticipationAdmin(@Param('adminId') adminId: string) {
  const id = parseInt(adminId);
  if (isNaN(id)) throw new BadRequestException('adminId invalide');
  return this.enqueteService.getParticipationParEnqueteByAdmin(id);
}

@Get('dashboard/top-enquetes/:adminId')
async getTopEnquetesAdmin(
  @Param('adminId') adminId: string,
  @Query('periode') periode: string,
  @Query('limit') limit: string
) {
  const id = parseInt(adminId);
  if (isNaN(id)) throw new BadRequestException('adminId invalide');
  return this.enqueteService.getTopEnquetesByAdmin(id, periode, parseInt(limit) || 5);
}

@Get('dashboard/recent-enquetes/:adminId') 
async getRecentEnquetesAdmin(
  @Param('adminId') adminId: string,
  @Query('limit') limit: string
) {
  const id = parseInt(adminId);
  if (isNaN(id)) throw new BadRequestException('adminId invalide');
  return this.enqueteService.getRecentEnquetesByAdmin(id, parseInt(limit) || 3);
}

@Get('dashboard/recent-activities/:adminId')
async getRecentActivitiesAdmin(
  @Param('adminId') adminId: string,
  @Query('limit') limit: string
) {
  const id = parseInt(adminId);
  if (isNaN(id)) throw new BadRequestException('adminId invalide');
  return this.enqueteService.getRecentActivitiesByAdmin(id, parseInt(limit) || 5);
}

@Get('dashboard/reclamations/:adminId')
async getReclamationsAdmin(@Param('adminId') adminId: string) {
  const id = parseInt(adminId);
  if (isNaN(id)) throw new BadRequestException('adminId invalide');
  const count = await this.enqueteService.getReclamationsCountByAdmin(id);
  return { count };
}

@Get('dashboard/risk-analysis/:adminId')
async getRiskAnalysisAdmin(@Param('adminId') adminId: string) {
  const id = parseInt(adminId);
  if (isNaN(id)) throw new BadRequestException('adminId invalide');
  return this.enqueteService.getRiskAnalysisByAdmin(id);
}

@Get('dashboard/satisfaction/:adminId')
async getSatisfactionAdmin(@Param('adminId') adminId: string) {
  const id = parseInt(adminId);
  if (isNaN(id)) throw new BadRequestException('adminId invalide');
  return this.enqueteService.getSatisfactionIndexByAdmin(id);
}

@Get('participation-type/:adminId')
async getParticipationTypeStats(@Param('adminId') adminId: string) {
  const id = parseInt(adminId);
  if (isNaN(id)) throw new BadRequestException('adminId invalide');
  return this.enqueteService.getParticipationTypeStats(id);
}
@Get('evolution-admin/:adminId')
async getEvolutionReponsesAdmin(@Param('adminId') adminId: string) {
  const id = parseInt(adminId);
  if (isNaN(id)) {
    throw new BadRequestException('adminId invalide');
  }
  return this.enqueteService.getEvolutionReponsesByAdmin(id);
}
}
