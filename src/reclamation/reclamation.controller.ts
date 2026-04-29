import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ReclamationService } from './reclamation.service';
import { CreateReclamationDto, UpdateReclamationDto, ReponseReclamationDto, FiltreReclamationDto } from './dto/create-reclamation.dto';

@Controller('reclamations')
export class ReclamationController {
  constructor(private readonly reclamationService: ReclamationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReclamationDto: CreateReclamationDto) {
    return this.reclamationService.create(createReclamationDto);
  }

  @Get()
  findAll(@Query() filtres?: FiltreReclamationDto) {
    return this.reclamationService.findAll(filtres);
  }

  @Get('stats')
  getStats() {
    return this.reclamationService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reclamationService.findOne(id);
  }

  @Get('statut/:statut')
  findByStatut(@Param('statut') statut: string) {
    return this.reclamationService.findByStatut(statut);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.reclamationService.findByUser(userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReclamationDto: UpdateReclamationDto
  ) {
    return this.reclamationService.update(id, updateReclamationDto);
  }

  @Patch(':id/statut')
  changerStatut(
    @Param('id', ParseIntPipe) id: number,
    @Body('statut') statut: string
  ) {
    return this.reclamationService.changerStatut(id, statut);
  }

  @Post(':id/repondre')
  repondreReclamation(
    @Param('id', ParseIntPipe) id: number,
    @Body() reponseDto: ReponseReclamationDto
  ) {
    return this.reclamationService.repondreReclamation(id, reponseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reclamationService.remove(id);
  }

  @Delete('batch')
  @HttpCode(HttpStatus.NO_CONTENT)
  supprimerMultiple(@Body('ids') ids: number[]) {
    return this.reclamationService.supprimerMultiple(ids);
  }

  @Patch('batch')
  updateMultiple(
    @Body('ids') ids: number[],
    @Body('data') updateData: Partial<UpdateReclamationDto>
  ) {
    return this.reclamationService.updateMultiple(ids, updateData);
  }
}