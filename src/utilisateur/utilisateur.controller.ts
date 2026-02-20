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
}