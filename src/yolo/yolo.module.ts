import { Module } from '@nestjs/common';
import { YoloService } from './yolo.service';
import { YoloController } from './yolo.controller';

@Module({
  controllers: [YoloController],
  providers: [YoloService],
})
export class YoloModule {}
