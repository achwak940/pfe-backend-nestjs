import { Test, TestingModule } from '@nestjs/testing';
import { ReponseController } from './reponse.controller';
import { ReponseService } from './reponse.service';

describe('ReponseController', () => {
  let controller: ReponseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReponseController],
      providers: [ReponseService],
    }).compile();

    controller = module.get<ReponseController>(ReponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
