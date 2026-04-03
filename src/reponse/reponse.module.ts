import { Module } from '@nestjs/common';
import { ReponseService } from './reponse.service';
import { ReponseController } from './reponse.controller';
import { Reponse } from './entities/reponse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enquete } from 'src/enquete/entities/enquete.entity';

@Module({
     imports:[TypeOrmModule.forFeature([Reponse]),TypeOrmModule.forFeature([Enquete])],
  controllers: [ReponseController],
  providers: [ReponseService],
})
export class ReponseModule {}
