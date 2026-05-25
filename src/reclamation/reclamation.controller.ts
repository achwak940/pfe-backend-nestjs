// src/reclamation/reclamation.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  HttpCode, HttpStatus, Query, ParseIntPipe,
  UseInterceptors, UploadedFile, Res, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import express from 'express';
import { ReclamationService } from './reclamation.service';
import {
  CreateReclamationDto,
  UpdateReclamationDto,
  ReponseReclamationDto,
  FiltreReclamationDto,
  YoloAnalysisDto,
} from './dto/create-reclamation.dto';

const multerConfig = {
  storage: memoryStorage(),
  fileFilter: (req, file, cb) => {
    console.log('🔍 Filtre fichier:', file.originalname, file.mimetype);
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return cb(new BadRequestException('Seules les images sont autorisées (jpg, jpeg, png, gif, webp)'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
};

@Controller('reclamations')
export class ReclamationController {
  constructor(private readonly reclamationService: ReclamationService) {}

  // ==================== ROUTES SANS PARAMÈTRES D'ABORD ====================
  
  @Get('administrateurs/reclamations')
  async getReclamationsAdministrateurs() {
    const data = await this.reclamationService.getReclamationsAdministrateurs();
    return { success: true, count: data.length, data };
  }

  @Get('stats')
  async getStats() {
    const stats = await this.reclamationService.getStats();
    return { success: true, data: stats };
  }

  @Get('stats/by-statut')
  async getCountByStatut() {
    const countByStatut = await this.reclamationService.getCountByStatut();
    return { success: true, data: countByStatut };
  }

  @Get('stats/by-gravite')
  async getCountByGravite() {
    const countByGravite = await this.reclamationService.getCountByGravite();
    return { success: true, data: countByGravite };
  }

  @Get('export/csv')
  async exportToCsv(
    @Res() res: express.Response,
    @Query() filtres?: FiltreReclamationDto,
  ) {
    const csv = await this.reclamationService.exportToCsv(filtres);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reclamations_${new Date().toISOString().split('T')[0]}.csv`,
    );
    res.send(csv);
  }

  // ==================== CRÉATION ====================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReclamationDto: CreateReclamationDto) {
    console.log('📝 POST /reclamations - Body:', createReclamationDto);
    return this.reclamationService.create(createReclamationDto);
  }

  @Post('with-image')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @HttpCode(HttpStatus.CREATED)
  async createWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    console.log('=== DEBUG createWithImage ===');
    console.log('📸 Fichier reçu:', file ? {
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      buffer: file.buffer ? `Buffer de ${file.buffer.length} bytes` : 'AUCUN BUFFER'
    } : 'AUCUN FICHIER');
    console.log('📝 Body reçu:', body);
    console.log('===============================');

    if (!file) {
      throw new BadRequestException('Aucune image fournie');
    }

    if (!file.buffer) {
      console.error('❌ ERREUR: file.buffer est undefined!');
      throw new BadRequestException('Erreur de lecture du fichier');
    }

    let reclamationData: CreateReclamationDto;

    if (body.data) {
      reclamationData = JSON.parse(body.data);
    } else {
      reclamationData = {
        titre: body.titre,
        description: body.description,
        typeDommage: body.typeDommage,
        totalSeverite: body.totalSeverite ? parseFloat(body.totalSeverite) : 0,
        dommagesDetectes: body.dommagesDetectes ? parseInt(body.dommagesDetectes) : 0,
        gravite: body.gravite ? parseFloat(body.gravite) : 0,
        confiance: body.confiance ? parseFloat(body.confiance) : 0,
        statut: body.statut,
        userId: body.userId ? parseInt(body.userId) : undefined,
        imageUrl: body.imageUrl,
        imageName: body.imageName,
      };
    }

    console.log('📦 Données préparées:', reclamationData);

    const result = await this.reclamationService.createWithImage(reclamationData, file);
    
    console.log('✅ Résultat final:', { id: result.id, imageUrl: result.imageUrl });
    
    return {
      success: true,
      message: 'Réclamation créée avec succès',
      data: result,
    };
  }

  @Post('debug-upload')
  @UseInterceptors(FileInterceptor('image'))
  async debugUpload(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    console.log('=== DEBUG UPLOAD ===');
    console.log('File:', file);
    console.log('Body:', body);
    console.log('===================');
    
    return {
      fileReceived: !!file,
      fileName: file?.originalname,
      fileSize: file?.size,
      hasBuffer: !!file?.buffer,
      body: body
    };
  }

  @Post('yolo')
  @HttpCode(HttpStatus.CREATED)
  async createFromYolo(
    @Body() body: { yoloResult: YoloAnalysisDto; userId: number },
  ) {
    return this.reclamationService.createFromYolo(body.yoloResult, body.userId);
  }

  // ==================== ACTIONS GROUPÉES (BATCH) AVANT LES ROUTES AVEC ID ====================
  
  @Delete('batch')
  @HttpCode(HttpStatus.OK)
  async supprimerMultiple(@Body('ids') ids: number[]) {
    console.log('🗑️ DELETE batch - IDs reçus:', ids);
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Liste d\'IDs invalide ou vide');
    }
    const result = await this.reclamationService.supprimerMultiple(ids);
    return {
      success: true,
      message: result.message,
      deletedCount: result.deleted,
    };
  }

  @Patch('batch')
  @HttpCode(HttpStatus.OK)
  async updateMultiple(
    @Body() body: { ids: number[]; data: Partial<UpdateReclamationDto> },
  ) {
    console.log('📦 PATCH batch - IDs:', body.ids, 'Data:', body.data);
    if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
      throw new BadRequestException('Liste d\'IDs invalide ou vide');
    }
    const result = await this.reclamationService.updateMultiple(body.ids, body.data);
    return {
      success: true,
      message: result.message,
      updatedCount: result.updated,
    };
  }

  // ==================== ROUTES AVEC PARAMÈTRES ====================

  @Get()
  async findAll(@Query() filtres?: FiltreReclamationDto) {
    const result = await this.reclamationService.findAll(filtres);
    return {
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    const reclamations = await this.reclamationService.findByUser(userId);
    return {
      success: true,
      data: reclamations,
      count: reclamations.length,
    };
  }

  @Get('statut/:statut')
  async findByStatut(@Param('statut') statut: string) {
    const reclamations = await this.reclamationService.findByStatut(statut);
    return {
      success: true,
      data: reclamations,
      count: reclamations.length,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const reclamation = await this.reclamationService.findOne(id);
    return {
      success: true,
      data: reclamation,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReclamationDto: UpdateReclamationDto,
  ) {
    const updated = await this.reclamationService.update(id, updateReclamationDto);
    return {
      success: true,
      message: 'Réclamation mise à jour avec succès',
      data: updated,
    };
  }

  @Patch(':id/statut')
  async changerStatut(
    @Param('id', ParseIntPipe) id: number,
    @Body('statut') statut: string,
  ) {
    const updated = await this.reclamationService.changerStatut(id, statut);
    return {
      success: true,
      message: `Statut changé avec succès vers ${statut}`,
      data: updated,
    };
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Aucune image fournie');
    }
    const updated = await this.reclamationService.updateImage(id, file);
    return {
      success: true,
      message: 'Image ajoutée avec succès',
      data: updated,
    };
  }

  @Post(':id/repondre')
  async repondreReclamation(
    @Param('id', ParseIntPipe) id: number,
    @Body() reponseDto: ReponseReclamationDto,
  ) {
    const updated = await this.reclamationService.repondreReclamation(id, reponseDto);
    return {
      success: true,
      message: 'Réponse envoyée avec succès par email',
      data: updated,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.reclamationService.remove(id);
    return {
      success: true,
      message: 'Réclamation supprimée avec succès',
    };
  }
}