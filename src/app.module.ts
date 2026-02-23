import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from './utilisateur/entities/utilisateur.entity';
import { AuthentificationModule } from './authentification/authentification.module';
import { EnqueteModule } from './enquete/enquete.module';
import { Enquete } from './enquete/entities/enquete.entity';

@Module({
  imports: [  
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(ConfigService :ConfigService)=>({
        type:'postgres',
        host:ConfigService.get('DB_HOST'),
        prot:ConfigService.get('DB_PORT'),
        username:ConfigService.get("DB_USERNAME"),
        password:ConfigService.get("DB_PASSWORD"),
        database:ConfigService.get("DB_NAME"),
        entities:[Utilisateur,Enquete],
        synchronize:true,//creation auto de table si n'existe pas 
      })
    }),
    UtilisateurModule,
    AuthentificationModule,
    EnqueteModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
