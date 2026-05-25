import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import FormData from 'form-data';

export interface RecommendRequest {
  device_enc: number;
  damage_enc: number;
  total_damage: number;
}

export interface Recommendation {
  solution: string;
  confidence: number;
}

export interface Analysis {
  analysis: {
    case_summary: string;
    damage_level: string;
    deep_analysis: string;
  };
  risks: {
    high: string[];
    medium: string[];
    low: string[];
  };
  recommendations_analysis: any[];
  decision: {
    final_choice: string;
    justification: string;
    risk_if_ignored: string;
  };
}

export interface RecommendResponse {
  severity: number;
  recommendations: Recommendation[];
  analysis: Analysis;
}

@Injectable()
export class RecommendationService {
  private readonly FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

  constructor(private readonly httpService: HttpService) {}

  async getRecommendations(data: RecommendRequest): Promise<RecommendResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<RecommendResponse>(
          `${this.FASTAPI_URL}/recommend`,
          {
            device_enc: data.device_enc,
            damage_enc: data.damage_enc,
            total_damage: data.total_damage
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 30000
          }
        )
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new HttpException(
          axiosError.response.data || 'FastAPI error',
          axiosError.response.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else if (axiosError.request) {
        throw new HttpException(
          'FastAPI service is not responding',
          HttpStatus.SERVICE_UNAVAILABLE
        );
      } else {
        throw new HttpException(
          axiosError.message || 'Internal error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async getPrediction(fileBuffer: Buffer, originalName: string, mimeType: string): Promise<any> {
    try {
      // Créer FormData avec le buffer
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: originalName,
        contentType: mimeType,
      });

      // Récupérer les headers et les convertir en objet simple
      const headers = formData.getHeaders();
      
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.FASTAPI_URL}/predict`,
          formData,
          {
            headers: headers,
            timeout: 60000
          }
        )
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new HttpException(
        axiosError.response?.data || 'Prediction failed',
        axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getPriceDuration(device_enc: number, damage_enc: number, total_damage: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.FASTAPI_URL}/predictPrixDuration`,
          {
            device_enc,
            damage_enc,
            total_damage
          },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        )
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new HttpException(
        axiosError.response?.data || 'Price/Duration prediction failed',
        axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}