import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { PrismaSurveyRepository } from './prismaSurvey.repository';
import { CustomerSurveyModel } from '../../../customer/model/customerSurvey.model';

describe('PrismaSurveyRepository', () => {
  let repository: PrismaSurveyRepository;
  let mockPrismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaSurveyRepository,
        {
          provide: PrismaService,
          useValue: {
            survey: {
              findFirst: jest.fn()
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaSurveyRepository>(
      PrismaSurveyRepository,
    );
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return survey with questions and customer answers', async () => {
    const mockSurveyId = randomUUID();
    const mockQuestionId = randomUUID()

    const mockFindFirst = jest
      .spyOn<any, any>(mockPrismaService.survey, 'findFirst')
      .mockImplementation(() => Promise.resolve({
        id: mockSurveyId,
        name: 'Survey',
        title: 'Customer Survey',
        questions: [
          {
            id: mockQuestionId,
            surveyId: mockSurveyId,
            question: 'Question',
            order: 1,
            customerAnswers: [
              {
                id: randomUUID(),
                costumerId: randomUUID(),
                answer: 'Yes',
                questionId: mockQuestionId
              },
              {
                id: randomUUID(),
                costumerId: randomUUID(),
                answer: 'Yes',
                questionId: mockQuestionId
              },
              {
                id: randomUUID(),
                costumerId: randomUUID(),
                answer: 'Yes',
                questionId: mockQuestionId
              }
            ]
          }
        ]
      }))

    const answers = await repository.getSurveyById(mockSurveyId);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        id: mockSurveyId,
      },
      include: {
        questions: {
          include: {
            customerAnswers: true
          }
        }
      }
    });
    expect(answers).toMatchObject({
        id: mockSurveyId,
        name: 'Survey',
        title: 'Customer Survey',
        questions: [
          {
            id: mockQuestionId,
            surveyId: mockSurveyId,
            question: 'Question',
            order: 1,
            customerAnswers: [
              {
                id: expect.any(String),
                costumerId: expect.any(String),
                answer: 'Yes',
                questionId: mockQuestionId
              },
              {
                id: expect.any(String),
                costumerId: expect.any(String),
                answer: 'Yes',
                questionId: mockQuestionId
              },
              {
                id: expect.any(String),
                costumerId: expect.any(String),
                answer: 'Yes',
                questionId: mockQuestionId
              }
            ]
          }
        ]
      });
  });
});
