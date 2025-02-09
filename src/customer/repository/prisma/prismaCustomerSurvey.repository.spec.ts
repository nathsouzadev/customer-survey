import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { PrismaCustomerSurveyRepository } from './prismaCustomerSurvey.repository';
import { mockCustomerSurvey } from '../../../__mocks__/customerSurvey.mock';

describe('PrismaCustomerSurveyRepository', () => {
  let repository: PrismaCustomerSurveyRepository;
  let mockPrismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCustomerSurveyRepository,
        {
          provide: PrismaService,
          useValue: {
            customerSurvey: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaCustomerSurveyRepository>(
      PrismaCustomerSurveyRepository,
    );
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return survey with customerId', async () => {
    const mockCustomerId = randomUUID();
    const mockSurveyId = randomUUID();
    const mockQuestionId = randomUUID();
    const mockQuestionId2 = randomUUID();
    const mockSurvey = mockCustomerSurvey({
      customerId: mockCustomerId,
      surveyId: mockSurveyId,
      questions: [
        { id: mockQuestionId, question: 'Question 1', order: 1 },
        { id: mockQuestionId2, question: 'Question 2', order: 2 },
      ],
    });

    const mockSave = jest
      .spyOn(mockPrismaService.customerSurvey, 'findFirst')
      .mockResolvedValue(mockSurvey);

    const survey = await repository.getSurveyByCustomerId(mockCustomerId);
    expect(mockSave).toHaveBeenCalledWith({
      where: {
        customerId: mockCustomerId,
        active: true,
      },
      include: {
        survey: {
          include: {
            questions: {
              include: {
                answers: {
                  orderBy: {
                    answer: 'asc',
                  },
                },
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });
    expect(survey).toMatchObject({
      id: expect.any(String),
      active: true,
      customerId: mockCustomerId,
      surveyId: mockSurveyId,
      survey: {
        id: mockSurveyId,
        companyId: expect.any(String),
        name: 'Survey',
        title: 'Main survey',
        questions: [
          {
            id: mockQuestionId,
            surveyId: mockSurveyId,
            question: 'Question 1',
            order: 1,
            answers: [
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
            ],
          },
          {
            id: mockQuestionId2,
            surveyId: mockSurveyId,
            question: 'Question 2',
            order: 2,
            answers: [
              {
                id: expect.any(String),
                questionId: mockQuestionId2,
                answer: '1',
                label: 'bom',
              },
              {
                id: expect.any(String),
                questionId: mockQuestionId2,
                answer: '2',
                label: 'regular',
              },
              {
                id: expect.any(String),
                questionId: mockQuestionId2,
                answer: '3',
                label: 'ruim',
              },
            ],
          },
        ],
      },
    });
  });

  it('should return active customers with surveyId', async () => {
    const mockSurveyId = randomUUID();
    const mockCompanyId = randomUUID();
    const mockCustomerId = randomUUID();
    const mockCustomerSurvey = [
      {
        id: randomUUID(),
        customerId: mockCustomerId,
        surveyId: mockSurveyId,
        active: true,
        customer: {
          id: mockCustomerId,
          name: 'Ada Lovelace',
          phoneNumber: '5511999991111',
          companyId: mockCompanyId,
          answers: [],
        },
      },
    ];
    const mockFindMany = jest
      .spyOn<any, any>(mockPrismaService.customerSurvey, 'findMany')
      .mockResolvedValue(mockCustomerSurvey);

    const customers = await repository.getCustomersBySurveyId(mockSurveyId);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        surveyId: mockSurveyId,
        active: true,
      },
      include: {
        customer: {
          include: {
            answers: true,
          },
        },
      },
    });
    expect(customers).toMatchObject([
      {
        id: expect.any(String),
        customerId: mockCustomerId,
        surveyId: mockSurveyId,
        active: true,
        customer: {
          id: mockCustomerId,
          name: 'Ada Lovelace',
          phoneNumber: '5511999991111',
          companyId: mockCompanyId,
        },
      },
    ]);
  });

  it('should be return customerSurvey created', async () => {
    const mockCustomerId = randomUUID();
    const mockSurveyId = randomUUID();
    const mockCreate = jest
      .spyOn<any, any>(mockPrismaService.customerSurvey, 'create')
      .mockResolvedValue({
        id: randomUUID(),
        active: true,
        customerId: mockCustomerId,
        surveyId: mockSurveyId,
      });

    const customerSurvey = await repository.createCustomerSurvey({
      customerId: mockCustomerId,
      surveyId: mockSurveyId,
    });
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        id: expect.any(String),
        active: true,
        customerId: mockCustomerId,
        surveyId: mockSurveyId,
      },
    });
    expect(customerSurvey).toMatchObject({
      id: expect.any(String),
      active: true,
      customerId: mockCustomerId,
      surveyId: mockSurveyId,
    });
  });
});
