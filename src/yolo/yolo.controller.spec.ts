import { Test, TestingModule } from '@nestjs/testing';
import { YoloController } from './yolo.controller';
import { YoloService } from './yolo.service';

describe('YoloController', () => {
  let controller: YoloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YoloController],
      providers: [YoloService],
    }).compile();

    controller = module.get<YoloController>(YoloController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
