import { Test, TestingModule } from '@nestjs/testing';
import { AiQuestionsService } from './ai-questions.service';

describe('AiQuestionsService', () => {
  let service: AiQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiQuestionsService],
    }).compile();

    service = module.get<AiQuestionsService>(AiQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
