import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';

@Injectable()
export class YoloService {
  async predict(filePath: string, originalName: string) {
    try {
      // Crée le FormData pour envoyer à FastAPI
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath), originalName);

      // Appel du serveur FastAPI
      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: formData.getHeaders(),
      });

      // Supprime le fichier temporaire si il existe
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      return response.data;
    } catch (error: any) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return { error: 'Erreur lors de l’appel au serveur YOLO', details: error.message };
    }
  }

  create(createYoloDto: any) {
    return 'This action adds a new yolo';
  }

  findAll() {
    return 'This action returns all yolo';
  }

  findOne(id: number) {
    return `This action returns a #${id} yolo`;
  }

  update(id: number, updateYoloDto: any) {
    return `This action updates a #${id} yolo`;
  }

  remove(id: number) {
    return `This action removes a #${id} yolo`;
  }
}