import { Test, TestingModule } from '@nestjs/testing';
import { YoloService } from './yolo.service';

describe('YoloService', () => {
  let service: YoloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YoloService],
    }).compile();

    service = module.get<YoloService>(YoloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
