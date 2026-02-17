import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilisateurModule } from './utilisateur/utilisateur.module';

@Module({
  imports: [UtilisateurModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
