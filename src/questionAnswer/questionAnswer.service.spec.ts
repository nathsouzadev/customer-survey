import { Test, TestingModule } from '@nestjs/testing';
import { QuestionAnswerService } from './questionAnswer.service';
import { QuestionAnswerRepository } from './repository/questionAnswer.repository';
import { randomUUID } from 'crypto';

describe('QuestionAnswerService', () => {
  let service: QuestionAnswerService;
  let mockQuestionAnswerRepository: QuestionAnswerRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionAnswerService,
        {
          provide: QuestionAnswerRepository,
          useValue: {
            getAnswersByQuestionId: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<QuestionAnswerService>(QuestionAnswerService);
    mockQuestionAnswerRepository = module.get<QuestionAnswerRepository>(QuestionAnswerRepository)
  });

  it('should return all answers with questionId', async() => {
    const mockQuestionId = randomUUID()
    const mockGetQuestionAnswers = jest.spyOn(mockQuestionAnswerRepository, 'getAnswersByQuestionId').mockImplementation(() => Promise.resolve(
      [
        {
          id: randomUUID(),
          questionId: mockQuestionId,
          answer: '1',
          label: 'bom',
        },
        {
          id: randomUUID(),
          questionId: mockQuestionId,
          answer: '2',
          label: 'regular',
        },
        {
          id: randomUUID(),
          questionId: mockQuestionId,
          answer: '3',
          label: 'ruim',
        },
      ]
    ))

    const answers = await service.getQuestionAnswers(mockQuestionId)
    expect(mockGetQuestionAnswers).toHaveBeenCalledWith(mockQuestionId)
    expect(answers).toMatchObject([
      {
        id: expect.any(String),
        questionId: mockQuestionId,
        answer: '1',
        label: 'bom',
      },
      {
        id: expect.any(String),
        questionId: mockQuestionId,
        answer: '2',
        label: 'regular',
      },
      {
        id: expect.any(String),
        questionId: mockQuestionId,
        answer: '3',
        label: 'ruim',
      },
    ])
  });
});
