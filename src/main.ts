import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as fs from 'fs';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  const path = join(__dirname,'..','uploads/profiles');
  if(!fs.existsSync(path)){
    fs.mkdirSync(path,{recursive:true})
  }
  
  app.use('/uploads',express.static(join(__dirname,'..','uploads')))
  
  // ⚠️ CHANGEZ CETTE LIGNE ⚠️
  // Avant : await app.listen(process.env.PORT ?? 3000);
  // Après :
  await app.listen(3000, '0.0.0.0'); // Écoute sur toutes les interfaces
  
  console.log('🚀 Serveur démarré sur:');
  console.log('   ➜ http://localhost:3000');
  console.log('   ➜ http://10.31.77.179:3000'); // Votre IP
}
bootstrap();