import { Controller, Post, Body, UploadedFile, UseInterceptors, HttpStatus, HttpException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecommendationService, RecommendRequest, RecommendResponse } from './recommendation.service';

// DTO pour la validation
class RecommendDto {
  device_enc: number;
  damage_enc: number;
  total_damage: number;
}

class PriceDurationDto {
  device_enc: number;
  damage_enc: number;
  total_damage: number;
}

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post('analyze')
  async getRecommendations(@Body() data: RecommendDto): Promise<RecommendResponse> {
    if (data.total_damage === undefined || data.total_damage === null) {
      throw new HttpException(
        'total_damage is required',
        HttpStatus.BAD_REQUEST
      );
    }

    if (typeof data.total_damage !== 'number') {
      throw new HttpException(
        'total_damage must be a number',
        HttpStatus.BAD_REQUEST
      );
    }

    return this.recommendationService.getRecommendations(data);
  }

  @Post('predict')
  @UseInterceptors(FileInterceptor('file'))
  async predictImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new HttpException(
        'Only JPEG, PNG images are allowed',
        HttpStatus.BAD_REQUEST
      );
    }

    // Passer directement le buffer, le nom et le type MIME au service
    return this.recommendationService.getPrediction(
      file.buffer,
      file.originalname,
      file.mimetype
    );
  }

  @Post('price-duration')
  async getPriceDuration(@Body() data: PriceDurationDto) {
    if (data.total_damage === undefined) {
      throw new HttpException(
        'total_damage is required',
        HttpStatus.BAD_REQUEST
      );
    }

    return this.recommendationService.getPriceDuration(
      data.device_enc,
      data.damage_enc,
      data.total_damage
    ); 
  } 
}