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
              create: jest.fn(),
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

  it('should create question from requeust', async () => {
    const mockQuestionId = randomUUID();
    const mockCreate = jest
      .spyOn<any, any>(mockPrismaService.question, 'create')
      .mockImplementation(() =>
        Promise.resolve({
          id: mockQuestionId,
          surveyId: mockSurveyId,
          question: 'Question 1',
          order: 1,
          answers: [
            {
              id: randomUUID(),
              questionId: mockQuestionId,
              answer: 'Bom',
              label: '1',
            },
            {
              id: randomUUID(),
              questionId: mockQuestionId,
              answer: 'Ruim',
              label: '2',
            },
          ],
        }),
      );
    const mockSurveyId = randomUUID();
    const mockRequest = {
      surveyId: mockSurveyId,
      question: 'Question 1',
      order: 1,
      answers: [
        {
          answer: 'Bom',
          label: '1',
        },
        {
          answer: 'Ruim',
          label: '2',
        },
      ],
    };

    const response = await repository.creatQuestions(mockRequest);
    expect(mockCreate).toHaveBeenCalled();
    expect(response).toMatchObject({
      id: expect.any(String),
      surveyId: mockSurveyId,
      question: 'Question 1',
      order: 1,
      answers: [
        {
          id: expect.any(String),
          questionId: expect.any(String),
          answer: 'Bom',
          label: '1',
        },
        {
          id: expect.any(String),
          questionId: expect.any(String),
          answer: 'Ruim',
          label: '2',
        },
      ],
    });
  });
});
