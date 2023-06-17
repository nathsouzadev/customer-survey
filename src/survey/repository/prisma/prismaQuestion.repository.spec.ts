import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { PrismaQuestionRepository } from './prismaQuestion.repository';

describe('PrismaQuestionRepository', () => {
  let repository: PrismaQuestionRepository;
  let mockPrismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaQuestionRepository,
        {
          provide: PrismaService,
          useValue: {
            question: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaQuestionRepository>(PrismaQuestionRepository);
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return question with order 1 and surveyId', async () => {
    const mockSurveyId = randomUUID();
    const mockQuestionId = randomUUID();

    const mockFindFirst = jest
      .spyOn<any, any>(mockPrismaService.question, 'findFirst')
      .mockResolvedValue({
        id: mockQuestionId,
        surveyId: mockSurveyId,
        question: 'Question',
        order: 1,
        answers: [
          {
            id: randomUUID(),
            questionId: mockQuestionId,
            answer: '1',
            label: 'Bom',
          },
          {
            id: randomUUID(),
            questionId: mockQuestionId,
            answer: '2',
            label: 'Regular',
          },
          {
            id: randomUUID(),
            questionId: mockQuestionId,
            answer: '3',
            label: 'Ruim',
          },
        ],
      });

    const question = await repository.getFirstQuestionBySurveyId(mockSurveyId);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        surveyId: mockSurveyId,
        order: 1,
      },
      include: {
        answers: true,
      },
    });
    expect(question).toMatchObject({
      id: expect.any(String),
      surveyId: mockSurveyId,
      question: 'Question',
      order: 1,
      answers: [
        {
          id: expect.any(String),
          questionId: mockQuestionId,
          answer: '1',
          label: 'Bom',
        },
        {
          id: expect.any(String),
          questionId: mockQuestionId,
          answer: '2',
          label: 'Regular',
        },
        {
          id: expect.any(String),
          questionId: mockQuestionId,
          answer: '3',
          label: 'Ruim',
        },
      ],
    });
  });
});
