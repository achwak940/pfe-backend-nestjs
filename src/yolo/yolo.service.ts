import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';

@Injectable()
export class YoloService {

  private fastApiUrl = 'http://localhost:8000';

  // =====================================================
  // 📸 1. YOLO ONLY (détection + boxes + severity)
  // =====================================================
  async yoloPredict(filePath: string, originalName: string) {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath), originalName);

      const response = await axios.post(
        `${this.fastApiUrl}/predict`,
        formData,
        { headers: formData.getHeaders() }
      );

      this.safeDelete(filePath);

      return response.data;

    } catch (error: any) {
      this.safeDelete(filePath);

      return {
        error: 'YOLO prediction failed',
        details: error.message,
      };
    }
  }

  // =====================================================
  // 💰 2. PRICE + DURATION ONLY (ML model)
  // =====================================================
  async predictPriceDuration(data: {
    total_damage: number,
    device_enc: number,
    damage_enc: number
  }) {

    try {
      const response = await axios.post(
        `${this.fastApiUrl}/predictPrixDuration`,
        data
      );

      return response.data;

    } catch (error: any) {
      return {
        error: 'Price/Duration prediction failed',
        details: error.message,
      };
    }
  }

  // =====================================================
  // 🧹 helper
  // =====================================================
  private safeDelete(filePath: string) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}