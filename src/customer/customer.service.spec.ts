import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './repository/customer.repository';
import { randomUUID } from 'crypto';
import { CustomerAnswerRepository } from './repository/customerAnswer.repository';
import { CustomerSurveyRepository } from './repository/customerSurvey.repository';
import { mockCustomerSurvey } from '../__mocks__/customerSurvey.mock';

describe('CustomerService', () => {
  let service: CustomerService;
  let mockCustomerRepository: CustomerRepository;
  let mockCustomerAnswerRepository: CustomerAnswerRepository;
  let mockCustomerSurveyRepository: CustomerSurveyRepository;

  const mockPhoneNumber = '5511999991111';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: CustomerRepository,
          useValue: {
            getCustomerByPhoneNumber: jest.fn(),
          },
        },
        {
          provide: CustomerAnswerRepository,
          useValue: {
            saveAnswer: jest.fn(),
            getAnswersByCustomerId: jest.fn(),
            getCustomerAnswersToSurvey: jest.fn(),
          },
        },
        {
          provide: CustomerSurveyRepository,
          useValue: {
            getSurveyByCustomerId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    mockCustomerRepository = module.get<CustomerRepository>(CustomerRepository);
    mockCustomerAnswerRepository = module.get<CustomerAnswerRepository>(
      CustomerAnswerRepository,
    );
    mockCustomerSurveyRepository = module.get<CustomerSurveyRepository>(
      CustomerSurveyRepository,
    );
  });

  it('should be return customer with phoneNumber', async () => {
    const mockGetCustomer = jest
      .spyOn(mockCustomerRepository, 'getCustomerByPhoneNumber')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          name: 'Ada Lovelace',
          phoneNumber: '5511999991111',
        }),
      );

    const customer = await service.getCustomer(mockPhoneNumber);
    expect(mockGetCustomer).toHaveBeenCalledWith(mockPhoneNumber);
    expect(customer).toMatchObject({
      id: expect.any(String),
      name: 'Ada Lovelace',
      phoneNumber: mockPhoneNumber,
    });
  });

  it('should be save customerAnswer', async () => {
    const mockCustomerId = randomUUID();
    const mockQuestionId = randomUUID();

    const mockAnswer = {
      id: randomUUID(),
      customerId: mockCustomerId,
      questionId: mockQuestionId,
      answer: 'bom',
    };

    const mockSaveAnswer = jest
      .spyOn(mockCustomerAnswerRepository, 'saveAnswer')
      .mockImplementation(() => Promise.resolve(mockAnswer));

    const response = await service.saveCustomerAnswer(mockAnswer);
    expect(mockSaveAnswer).toHaveBeenCalledWith(mockAnswer);
    expect(response).toMatchObject({
      id: expect.any(String),
      customerId: mockCustomerId,
      questionId: mockQuestionId,
      answer: 'bom',
    });
  });

  it('should return survey with founded by phoneNumber ordered by question order number', async () => {
    const mockCustomerId = randomUUID();
    const mockPhoneNumber = '5511999991111';
    const mockSurveyId = randomUUID();
    const mockQuestionId = randomUUID();
    const mockQuestionId2 = randomUUID();

    const mockSurvey = mockCustomerSurvey({
      customerId: mockCustomerId,
      surveyId: mockSurveyId,
      questions: [
        { id: mockQuestionId2, question: 'Question 2', order: 2 },
        { id: mockQuestionId, question: 'Question 1', order: 1 },
      ],
    });

    const mockGetCustomer = jest
      .spyOn(mockCustomerRepository, 'getCustomerByPhoneNumber')
      .mockImplementation(() =>
        Promise.resolve({
          id: mockCustomerId,
          name: 'Ada Lovelace',
          phoneNumber: mockPhoneNumber,
        }),
      );
    const mockGetSurvey = jest
      .spyOn(mockCustomerSurveyRepository, 'getSurveyByCustomerId')
      .mockImplementation(() => Promise.resolve(mockSurvey));

    const survey = await service.getSurvey(mockPhoneNumber);
    expect(mockGetCustomer).toHaveBeenCalledWith(mockPhoneNumber);
    expect(mockGetSurvey).toHaveBeenCalledWith(mockCustomerId);
    expect(survey).toMatchObject({
      id: expect.any(String),
      active: true,
      customerId: mockCustomerId,
      surveyId: mockSurveyId,
      survey: {
        id: mockSurveyId,
        name: 'Survey',
        title: 'Main survey',
        questions: [
          {
            id: mockQuestionId,
            surveyId: mockSurveyId,
            question: 'Question 1',
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

  it('shoul return all customerAnswer to questionId', async () => {
    const mockCustomerId = randomUUID();
    const mockQuestionIds = [randomUUID(), randomUUID()];
    const mockGetCustomerAnswers = jest
      .spyOn(mockCustomerAnswerRepository, 'getCustomerAnswersToSurvey')
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: randomUUID(),
            customerId: mockCustomerId,
            questionId: mockQuestionIds[0],
            answer: 'bom',
          },
          {
            id: randomUUID(),
            customerId: mockCustomerId,
            questionId: mockQuestionIds[1],
            answer: 'bom',
          },
        ]),
      );

    const answers = await service.getCustomerAnswersToSurvey({
      customerId: mockCustomerId,
      questionsId: mockQuestionIds,
    });
    expect(mockGetCustomerAnswers).toHaveBeenCalledWith({
      customerId: mockCustomerId,
      questionsId: mockQuestionIds,
    });
    expect(answers).toMatchObject([
      {
        id: expect.any(String),
        customerId: mockCustomerId,
        questionId: mockQuestionIds[0],
        answer: 'bom',
      },
      {
        id: expect.any(String),
        customerId: mockCustomerId,
        questionId: mockQuestionIds[1],
        answer: 'bom',
      },
    ]);
  });
});
