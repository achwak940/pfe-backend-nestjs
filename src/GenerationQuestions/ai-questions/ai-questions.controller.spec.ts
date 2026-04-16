import { Test, TestingModule } from '@nestjs/testing';
import { AiQuestionsController } from './ai-questions.controller';

describe('AiQuestionsController', () => {
  let controller: AiQuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiQuestionsController],
    }).compile();

    controller = module.get<AiQuestionsController>(AiQuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
