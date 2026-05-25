import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { Notification } from 'src/notification/entities/notification.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Role,Utilisateur,Notification])],
  
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
