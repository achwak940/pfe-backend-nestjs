// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configuration CORS
  app.enableCors({
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With', 'Origin'],
    exposedHeaders: ['Content-Disposition'],
  });
  
  // Création des dossiers nécessaires
  const uploadsDir = join(process.cwd(), 'uploads');
  const reclamationsPath = join(uploadsDir, 'reclamations');
  const profilesPath = join(uploadsDir, 'profiles');  // 👈 AJOUTER CETTE LIGNE
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    logger.log(`✅ Dossier créé: ${uploadsDir}`);
  }
  
  if (!fs.existsSync(reclamationsPath)) {
    fs.mkdirSync(reclamationsPath, { recursive: true });
    logger.log(`✅ Dossier créé: ${reclamationsPath}`);
  }
  
  // 👈 AJOUTER CETTE SECTION POUR LES PHOTOS DE PROFIL
  if (!fs.existsSync(profilesPath)) {
    fs.mkdirSync(profilesPath, { recursive: true });
    logger.log(`✅ Dossier créé: ${profilesPath}`);
  }
  
  // Servir les fichiers statiques des réclamations
  app.useStaticAssets(reclamationsPath, {
    prefix: '/uploads/reclamations/',
  });
  
  // 👈 AJOUTER CETTE LIGNE POUR SERVIR LES PHOTOS DE PROFIL
  app.useStaticAssets(profilesPath, {
    prefix: '/uploads/profiles/',
  });
  
  // Démarrer le serveur
  const port = 3000;
  await app.listen(port, '0.0.0.0');
  
  logger.log(`🚀 Serveur démarré sur http://localhost:${port}`);
  logger.log(`📁 Réclamations disponibles sur http://localhost:${port}/uploads/reclamations/`);
  logger.log(`👤 Profils disponibles sur http://localhost:${port}/uploads/profiles/`); // 👈 AJOUTER
  
  // Afficher les fichiers existants
  if (fs.existsSync(reclamationsPath)) {
    const files = fs.readdirSync(reclamationsPath);
    logger.log(`📸 ${files.length} réclamation(s) trouvée(s)`);
  }
  
  // 👈 AJOUTER CETTE SECTION POUR AFFICHER LES PHOTOS DE PROFIL
  if (fs.existsSync(profilesPath)) {
    const files = fs.readdirSync(profilesPath);
    logger.log(`👤 ${files.length} photo(s) de profil trouvée(s)`);
    if (files.length > 0) {
      files.forEach(file => {
        logger.log(`   📷 http://localhost:${port}/uploads/profiles/${file}`);
      });
    }
  }
}

bootstrap();