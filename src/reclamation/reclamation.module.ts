import { Module } from '@nestjs/common';
import { ReclamationService } from './reclamation.service';
import { ReclamationController } from './reclamation.controller';
import { Reclamation } from './entities/reclamation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';

@Module({
  controllers: [ReclamationController],
  imports: [  TypeOrmModule.forFeature([Reclamation,Utilisateur])],
  providers: [ReclamationService],
})
export class ReclamationModule {}
