import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as fs from 'fs';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration CORS
  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // Création du dossier profiles s'il n'existe pas
  const profilesPath = join(__dirname, '..', 'uploads', 'profiles');
  if (!fs.existsSync(profilesPath)) {
    fs.mkdirSync(profilesPath, { recursive: true });
  }
  
  // Création du dossier reclamations s'il n'existe pas
  const reclamationsPath = join(__dirname, '..', 'uploads', 'reclamations');
  if (!fs.existsSync(reclamationsPath)) {
    fs.mkdirSync(reclamationsPath, { recursive: true });
  }
  
  // Servir les fichiers statiques du dossier uploads
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  
  // Servir spécifiquement le dossier reclamations
  app.use('/uploads/reclamations', express.static(join(__dirname, '..', 'uploads', 'reclamations')));
  
  // Démarrer le serveur sur toutes les interfaces (0.0.0.0) pour l'accès réseau
  await app.listen(3000, '0.0.0.0');
  
  console.log('🚀 Serveur démarré avec succès!');
  console.log('   ➜ Local: http://localhost:3000');
  console.log('   ➜ Réseau: http://10.31.77.179:3000');
  console.log('   ➜ Uploads disponibles sur: http://localhost:3000/uploads/');
  console.log('   ➜ Images des réclamations: http://localhost:3000/uploads/reclamations/');
}

bootstrap();