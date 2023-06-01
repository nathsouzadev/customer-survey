import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { CustomerService } from '../../customer/customer.service';
import { randomUUID } from 'crypto';
import { mockCustomerSurvey } from '../../__mocks__/customerSurvey.mock';
import { SurveyRepository } from '../repository/survey.repository';

describe('SurveyService', () => {
  let service: SurveyService;
  let mockCustomerService: CustomerService;
  let mockSurveyRepository: SurveyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: CustomerService,
          useValue: {
            saveCustomerAnswer: jest.fn(),
            getSurvey: jest.fn(),
            getCustomerAnswersToSurvey: jest.fn(),
          },
        },
        {
          provide: SurveyRepository,
          useValue: {
            getSurveyById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    mockCustomerService = module.get<CustomerService>(CustomerService);
    mockSurveyRepository = module.get<SurveyRepository>(SurveyRepository);
  });

  it('should be return survey', async () => {
    const mockSurveyId = randomUUID();
    const mockQuestionId = randomUUID();

    const mockGetSurvey = jest
      .spyOn<any, any>(mockSurveyRepository, 'getSurveyById')
      .mockImplementation(() =>
        Promise.resolve({
          id: mockSurveyId,
          companyId: randomUUID(),
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
                  questionId: mockQuestionId,
                },
                {
                  id: randomUUID(),
                  costumerId: randomUUID(),
                  answer: 'Yes',
                  questionId: mockQuestionId,
                },
                {
                  id: randomUUID(),
                  costumerId: randomUUID(),
                  answer: 'No',
                  questionId: mockQuestionId,
                },
                {
                  id: randomUUID(),
                  costumerId: randomUUID(),
                  answer: 'No',
                  questionId: mockQuestionId,
                },
              ],
            },
          ],
        }),
      );

    const survey = await service.getSurvey();
    expect(mockGetSurvey).toHaveBeenCalledWith(
      '29551fe2-3059-44d9-ab1a-f5318368b88f',
    );
    expect(survey).toMatchObject({
      id: mockSurveyId,
      companyId: expect.any(String),
      name: 'Survey',
      title: 'Customer Survey',
      questions: [
        {
          id: mockQuestionId,
          surveyId: mockSurveyId,
          question: 'Question',
          answers: [
            { label: 'Yes', quantity: 2 },
            { label: 'No', quantity: 2 },
          ],
        },
      ],
    });
  });

  it('should be add a new answer to survey and return nextQuestion with question', async () => {
    const mockCustomerId = randomUUID();
    const mockSurveyId = randomUUID();
    const mockQuestionId = randomUUID();
    const mockQuestionId2 = randomUUID();
    const mockPhoneNumber = '5511999991111';

    const mockSurvey = mockCustomerSurvey({
      customerId: mockCustomerId,
      surveyId: mockSurveyId,
      questions: [
        { id: mockQuestionId, question: 'Question 1', order: 1 },
        { id: mockQuestionId2, question: 'Question 2', order: 2 },
      ],
    });

    const mockSaveCustomerAnswer = jest
      .spyOn(mockCustomerService, 'saveCustomerAnswer')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          customerId: mockCustomerId,
          questionId: mockQuestionId,
          answer: 'bom',
        }),
      );
    const mockGetSurvey = jest
      .spyOn(mockCustomerService, 'getSurvey')
      .mockImplementation(() => Promise.resolve(mockSurvey));
    const mockGetCustomerAnswers = jest
      .spyOn(mockCustomerService, 'getCustomerAnswersToSurvey')
      .mockImplementation(() => Promise.resolve([]));

    const response = await service.addAnswerToSurvey({
      answer: '1',
      customer: mockPhoneNumber,
    });
    expect(mockGetSurvey).toHaveBeenCalledWith(mockPhoneNumber);
    expect(mockGetCustomerAnswers).toHaveBeenCalledWith({
      customerId: mockCustomerId,
      questionsId: [mockQuestionId, mockQuestionId2],
    });
    expect(mockSaveCustomerAnswer).toHaveBeenCalledWith({
      id: expect.any(String),
      customerId: mockCustomerId,
      questionId: mockQuestionId,
      answer: 'bom',
    });
    expect(response).toMatchObject({
      answerReceived: {
        id: expect.any(String),
        customerId: mockCustomerId,
        questionId: mockQuestionId,
        answer: 'bom',
      },
      nextQuestion: 'Question 2 \n1 - bom\n2 - regular\n3 - ruim',
    });
  });

  it('should be add a new answer to survey and return nextQuestion with null', async () => {
    const mockCustomerId = randomUUID();
    const mockSurveyId = randomUUID();
    const mockQuestionId = randomUUID();
    const mockQuestionId2 = randomUUID();
    const mockPhoneNumber = '5511999992222';

    const mockSurvey = mockCustomerSurvey({
      customerId: mockCustomerId,
      surveyId: mockSurveyId,
      questions: [
        { id: mockQuestionId, question: 'Question 1', order: 1 },
        { id: mockQuestionId2, question: 'Question 2', order: 2 },
      ],
    });

    const mockSaveCustomerAnswer = jest
      .spyOn(mockCustomerService, 'saveCustomerAnswer')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          customerId: mockCustomerId,
          questionId: mockQuestionId2,
          answer: 'bom',
        }),
      );
    const mockGetSurvey = jest
      .spyOn(mockCustomerService, 'getSurvey')
      .mockImplementation(() => Promise.resolve(mockSurvey));
    const mockGetCustomerAnswers = jest
      .spyOn(mockCustomerService, 'getCustomerAnswersToSurvey')
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: randomUUID(),
            customerId: mockCustomerId,
            questionId: mockQuestionId,
            answer: 'bom',
          },
        ]),
      );

    const response = await service.addAnswerToSurvey({
      answer: '1',
      customer: mockPhoneNumber,
    });
    expect(mockGetSurvey).toHaveBeenCalledWith(mockPhoneNumber);
    expect(mockGetCustomerAnswers).toHaveBeenCalledWith({
      customerId: mockCustomerId,
      questionsId: [mockQuestionId, mockQuestionId2],
    });
    expect(mockSaveCustomerAnswer).toHaveBeenCalledWith({
      id: expect.any(String),
      questionId: mockQuestionId2,
      customerId: mockCustomerId,
      answer: 'bom',
    });
    expect(response).toMatchObject({
      answerReceived: {
        id: expect.any(String),
        questionId: mockQuestionId2,
        customerId: mockCustomerId,
        answer: 'bom',
      },
      nextQuestion: null,
    });
  });
});
