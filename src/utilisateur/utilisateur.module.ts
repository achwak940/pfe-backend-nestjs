import { Module } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurController } from './utilisateur.controller';
import { Utilisateur } from './entities/utilisateur.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports:[TypeOrmModule.forFeature([Utilisateur])],
  controllers: [UtilisateurController],
  providers: [UtilisateurService],
})
export class UtilisateurModule {}
