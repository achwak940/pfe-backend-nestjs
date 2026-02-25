import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { Status } from './status.enum';
import { Role } from './role.enum';
@Controller('utilisateur')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}
  @Post('/register')
  create(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return this.utilisateurService.create(createUtilisateurDto);
  }
  @Get('/all')
  findAll() {
    return this.utilisateurService.getAllusers();
  }
  @Get('/search')
  filtrageUsers(@Query('query') query:string){
    return this.utilisateurService.searchUsers(query);
  }
  @Get('/verification')
  verificationToken(@Query('token') token: string) {
    if (!token) {
      return { erreur: 'Le token est manquant' };
    }
    return this.utilisateurService.verificationToken(token);
  }
  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.utilisateurService.FindUserById(+id);
  }
  @Patch(':id/statuts')
  changeStatus(@Param('id') id: number, @Body('statut') statut: Status) {
    return this.utilisateurService.changeStatus(id, statut);
  }
   @Patch(':id/role')
  changeRole(@Param('id') id: number, @Body('role') role:Role) {
    return this.utilisateurService.chnageRole(id,role);
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
  @Get("/enquetes/:id")
  findenquetebyuser(@Param('id') id: number){
   return  this.utilisateurService.findEnquetesByUser(id)

  }
  @Get('/enquetes/count/:id')
async getNumberEnquetesByUser(@Param('id') id: number) {
    return await this.utilisateurService.findNumberEnquetesByUser(id);
}
@Get('/enquetes/brullion/:id')
async getAllEnqueteStatuBruillon(@Param('id') id:number){

  const allenqueteBrullion= await this.utilisateurService.findEnqueteAvecStatutBrouillonByUser(id)
  if(!allenqueteBrullion || allenqueteBrullion.length===0){
    return{
      message:"Aucune enquête en brullion trouvée",
      data:[]

    }
  }
    return{
      message:'Voici liste des enuqêtes avec le statu brullion',
      data:[allenqueteBrullion]
    }

}
@Get('/enquetes/ferme/:id')
async getAllEnqueteFerme(@Param('id') id:number)
{
  const listeEnqueteFerme=await this.utilisateurService.findEnqueteAvecStatutFermeByUser(id)
  if(!listeEnqueteFerme || listeEnqueteFerme.length===0){
    return {
      message:'Aucune enquête fermée trouvée',
      data:[]
    }
  }
  return{
    message:'Voici liste des enuqêtes avec le statu fermée',
    data:listeEnqueteFerme
  }

}
@Get('/all/Publiee')
async getAllEnquetePubliee(@Param('id') id:number){
  const allEnquetePublie=await this.utilisateurService.findEnqueteAvecStatutPublieeByUser(id)
  if(!allEnquetePublie||allEnquetePublie.length===0){
    return {
      message:'Aucune enquête Publiée trouvée',
      data:[]
    }

  }
return {
      message:'Voici liste des enuqêtes avec le statu Publiée',
      data:[]
    }
}
}