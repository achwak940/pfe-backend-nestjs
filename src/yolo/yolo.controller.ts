import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { YoloService } from './yolo.service';

@Controller('yolo')
export class YoloController {
  constructor(private readonly yoloService: YoloService) {}

  // =========================
  // 📸 YOLO ONLY
  // =========================
  @Post('predict')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${unique}${ext}`);
        },
      }),
    }),
  )
  async yoloPredict(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { error: 'No file uploaded' };

    return this.yoloService.yoloPredict(file.path, file.originalname);
  }

  // =========================
  // 💰 PRICE + DURATION ONLY
  // =========================
  @Post('predict-price-duration')
  async predictPriceDuration(@Body() body: any) {

    const { total_damage, device_enc, damage_enc } = body;

    if (total_damage === undefined) {
      return { error: 'total_damage is required' };
    }

    return this.yoloService.predictPriceDuration({
      total_damage,
      device_enc,
      damage_enc,
    });
  }
}