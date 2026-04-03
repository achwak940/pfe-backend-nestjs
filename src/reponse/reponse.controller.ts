// reponse.controller.ts - Version corrigée
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { ReponseService } from './reponse.service';
import { CreateReponseDto } from './dto/create-reponse.dto';
import { UpdateReponseDto } from './dto/update-reponse.dto';
import type { Response } from 'express'; // Utiliser 'import type' pour éviter l'erreur TS1272

@Controller('reponse')
export class ReponseController {
  constructor(private readonly reponseService: ReponseService) {}

  @Post()
  create(@Body() createReponseDto: CreateReponseDto) {
    return this.reponseService.create(createReponseDto);
  }

  @Get()
  findAll() {
    return this.reponseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reponseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReponseDto: UpdateReponseDto) {
    return this.reponseService.update(+id, updateReponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reponseService.remove(+id);
  }

  @Get('GetByAdmin/:id')
  async getAllReponse(@Param('id') id: string) {
    return this.reponseService.getReponsesByAdmin(+id);
  }

  @Get('get/all/:id')
  async getAllReponses(@Param('id') id: string) {
    return this.reponseService.getallReponses(+id);
  }

  @Get('exportExcel/all/:id')
  async exportUtilisateursConnecte(@Res() res: Response, @Param('id') id: string) {
    try {
      const fileExcel = await this.reponseService.exportExcel(+id);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=reponses.xlsx',
      );
      await fileExcel.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("EXPORT ERROR ❌", error);
      res.status(500).send("Erreur export");
    }
  }

  @Get('export-pdf/reponses/:id')
  async exportPDFReponses(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    try {
      const pdfBuffer = await this.reponseService.exportPDFReponses(+id);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=reponses.pdf',
        'Content-Length': pdfBuffer.length,
      });
      res.end(pdfBuffer);
    } catch (error) {
      console.error('PDF ERROR ❌', error);
      res.status(500).send('Erreur export PDF');
    }
  }

  @Get('export-csv/reponses/:id')
  async exportCSV(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    try {
      const csv = await this.reponseService.exportCSV(+id);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=reponses.csv'
      );
      res.send(csv);
    } catch (error) {
      console.error('CSV ERROR ❌', error);
      res.status(500).send('Erreur export CSV');
    }
  }

  @Get("/count/All/Reponses/:id")
  async countReponses(@Param('id') id: string) {
    return this.reponseService.countAllReponses(+id);
  }

  @Get("/detailles/:id")
  async deatilleReponse(@Param('id') id: string) {
    return this.reponseService.getAllReponsesDetail(+id);
  }

  @Get('stats/enquetes/:id')
  async getStatsParEnquete(@Param('id') id: string) {
    return this.reponseService.getStatsParEnquete(+id);
  }

  @Get('top-users/:id')
  async getTopUtilisateurs(@Param('id') id: string) {
    return this.reponseService.getTopUtilisateurs(+id);
  }

  @Get('taux-completion/:id')
  async getTauxCompletionGlobal(@Param('id') id: string) {
    return this.reponseService.getTauxCompletionGlobal(+id);
  }

  @Get('participation-periode/:id')
  async getParticipationParPeriode(@Param('id') id: string) {
    return this.reponseService.getParticipationParPeriode(+id);
  }

  // Nouveaux endpoints pour le dashboard
  @Get('evolution-reponses/:id')
  async getEvolutionReponses(
    @Param('id') id: string,
    @Query('periode') periode: string = 'week'
  ) {
    return this.reponseService.getEvolutionReponses(+id, periode);
  }

  @Get('survey-status/:id')
  async getSurveyStatusStats(@Param('id') id: string) {
    return this.reponseService.getSurveyStatusStats(+id);
  }

  @Get('participation-enquetes/:id')
  async getParticipationParEnquete(@Param('id') id: string) {
    return this.reponseService.getParticipationParEnquete(+id);
  }

  @Get('top-enquetes/:id')
  async getTopEnquetes(
    @Param('id') id: string,
    @Query('periode') periode: string = 'week',
    @Query('limit') limit: string = '5'
  ) {
    return this.reponseService.getTopEnquetes(+id, periode, +limit);
  }

  @Get('recent-enquetes/:id')
  async getRecentEnquetes(
    @Param('id') id: string,
    @Query('limit') limit: string = '3'
  ) {
    return this.reponseService.getRecentEnquetes(+id, +limit);
  }

  @Get('recent-activities/:id')
  async getRecentActivities(
    @Param('id') id: string,
    @Query('limit') limit: string = '5'
  ) {
    return this.reponseService.getRecentActivities(+id, +limit);
  }
}