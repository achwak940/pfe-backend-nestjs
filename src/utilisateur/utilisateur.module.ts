import { Module } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurController } from './utilisateur.controller';
import { Utilisateur } from './entities/utilisateur.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enquete } from 'src/enquete/entities/enquete.entity';
import { Reponse } from 'src/reponse/entities/reponse.entity';
@Module({
  imports:[TypeOrmModule.forFeature([Utilisateur,Enquete,Reponse])],
  controllers: [UtilisateurController],
  providers: [UtilisateurService],
})
export class UtilisateurModule {}
