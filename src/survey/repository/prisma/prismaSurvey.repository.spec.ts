import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { PrismaSurveyRepository } from './prismaSurvey.repository';
import { getMockSurveyResult } from '../../../__mocks__/surveyResult.mock';
import { mockCreateSurveyRequest } from '../../../__mocks__/createSurveyRequesst.mock';

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
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaSurveyRepository>(PrismaSurveyRepository);
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return survey with questions and customer answers', async () => {
    const mockSurveyId = randomUUID();
    const mockQuestionId = randomUUID();
    const mockCompanyId = randomUUID();
    const mockSurvey = getMockSurveyResult({
      companyId: mockCompanyId,
      surveyId: mockSurveyId,
      questionId: mockQuestionId,
    });

    const mockFindFirst = jest
      .spyOn<any, any>(mockPrismaService.survey, 'findFirst')
      .mockImplementation(() => Promise.resolve(mockSurvey));

    const answers = await repository.getSurveyResultById(mockSurveyId);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        id: mockSurveyId,
      },
      include: {
        questions: {
          include: {
            customerAnswers: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
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
              customerId: expect.any(String),
              answer: 'Yes',
              questionId: mockQuestionId,
            },
            {
              id: expect.any(String),
              customerId: expect.any(String),
              answer: 'Yes',
              questionId: mockQuestionId,
            },
            {
              id: expect.any(String),
              customerId: expect.any(String),
              answer: 'Yes',
              questionId: mockQuestionId,
            },
          ],
        },
      ],
    });
  });

  it('should create survey with questions and answers', async () => {
    const mockCompanyId = randomUUID();
    const mockRequest = mockCreateSurveyRequest({
      companyId: mockCompanyId,
    });
    const mockCreate = jest
      .spyOn<any, any>(mockPrismaService.survey, 'create')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          companyId: mockCompanyId,
          name: 'Survey',
          title: 'Survey title',
        }),
      );

    const response = await repository.createSurvey(mockRequest);
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        id: expect.any(String),
        companyId: mockCompanyId,
        name: 'Survey',
        title: 'Survey title',
      },
    });
    expect(response).toMatchObject({
      id: expect.any(String),
      companyId: mockCompanyId,
      name: 'Survey',
      title: 'Survey title',
    });
  });
});
