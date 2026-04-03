import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { EnqueteService } from './enquete.service';
import { CreateEnqueteDto } from './dto/create-enquete.dto';
import { UpdateEnqueteDto } from './dto/update-enquete.dto';
import { StatusEnquete } from './entities/status.enum';
import { TypeParticipation } from './entities/TypeParticipation.enum';
@Controller('enquete')
export class EnqueteController {
  constructor(private readonly enqueteService: EnqueteService) {}
  @Post('/creation')
  create(@Body() createEnqueteDto: CreateEnqueteDto) {
    return this.enqueteService.create(createEnqueteDto);
  
  }
  @Get("/all")
  findAll() {
    return this.enqueteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enqueteService.findEnqueteByid(+id);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateEnqueteDto: UpdateEnqueteDto) {
    return this.enqueteService.update(+id, updateEnqueteDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.enqueteService.remove(+id);
  }
  @Get('/findbyuser/:id')
  findenquetebyUser(id:number){
    return this.enqueteService.findByUser(id)
  }
@Patch('/change-statut/:id')
changeStatut(
    @Param('id') id: string,
    @Body('statut') statut: StatusEnquete
) 
{
    return this.enqueteService.changeStatut(+id, statut);
}
@Get("/all/EnBrullion")
async findAllEnqueteBrullion() {
  const allEnqueteBrullion =
    await this.enqueteService.getAllenqueteEnBrullion();

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
async findAllEnqueteFerme(){
  const allEnqueteFerme=await this.enqueteService.getAllEnqueteFerme()
  if(!allEnqueteFerme || allEnqueteFerme.length===0){
    return {
      message:'Aucune enquête ferme trouvée',
      data:[]
    }

  }
  return{
    message:'Voici la liste des enquêtes avec le statut ferme',
    data:allEnqueteFerme
  }
}
@Get("/all/Publiee")
async findallEnquetePubliee(){
  const allEnquetePubliee=await this.enqueteService.getAllEnquetePubliee()
  if(! allEnquetePubliee ||  allEnquetePubliee.length===0){
    return{
      message:"Aucune enquête Publiée trouvée",
      data:[]
    }

  }
  return{
    message:"Voici liste des enuqêtes avec le statu Publiée",
    data:allEnquetePubliee
  }

}
@Get("/all/Archivee")
async getallEnqueteArchive(){
  const allEnqueteArchive=await this.enqueteService.getAllEnqueteArchive()
  if(!allEnqueteArchive || allEnqueteArchive.length===0){
    return{
      message:"Aucune enquête Archivée trouvée",
      data:[]
    }

  }
  return{
    message:"Voici liste des enuqêtes avec le statu Archivée",
    data:allEnqueteArchive
  }
}
@Patch("/changeTypeParticipation/:id")
  changeTypeParticipation(@Param('id') id: number, @Body('typeParticipation') type:TypeParticipation) {
    return this.enqueteService.changeTypedeParticipation(id,type)
  }
  @Get("participants/:userId")
  async getNombreuserByAdmin(@Param('userId')userId:number){
    return this.enqueteService.getNombreParticipantByAdmin(userId)
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
@Get(':id/stats')
async getEnqueteStats(@Param('id') id: string) {
  return this.enqueteService.getEnqueteStats(+id);
}

@Get(':id/evolution')
async getEvolutionReponses(@Param('id') id: string) {
  return this.enqueteService.getEvolutionReponses(+id);
}

@Get(':id/question/:questionId/reponses')
async getReponsesByQuestion(
  @Param('id') id: string,
  @Param('questionId') questionId: string
) {
  return this.enqueteService.getReponsesByQuestion(+id, +questionId);
}

@Get(':id/qrcode')
async generateQRCode(@Param('id') id: string) {
  const qrBuffer = await this.enqueteService.generateQRCode(+id);
  return new Response(qrBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="qrcode_enquete_${id}.png"`
    }
  });
}

@Patch(':id/publier')
async publishEnquete(@Param('id') id: string) {
  return this.enqueteService.changeStatut(+id, StatusEnquete.Publiee);
}

@Patch(':id/archiver')
async archiveEnquete(@Param('id') id: string) {
  return this.enqueteService.changeStatut(+id, StatusEnquete.archive);
}
}
