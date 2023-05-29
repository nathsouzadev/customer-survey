import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { CustomerService } from '../../customer/customer.service';
import { randomUUID } from 'crypto';
import { mockCustomerSurvey } from '../../__mocks__/customerSurvey.mock';

describe('SurveyService', () => {
  let service: SurveyService;
  let mockCustomerService: CustomerService;

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
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    mockCustomerService = module.get<CustomerService>(CustomerService);
  });

  it('should be return survey', () => {
    const survey = service.getSurvey();
    expect(survey).toMatchObject({
      id: 'survey',
      name: 'Exampled Survey',
      title: 'Customer Experience',
      questions: [
        {
          id: 'question',
          surveyId: 'survey',
          question: 'Como você avalia o nosso atendimento?',
          answers: [
            { label: 'bom', quantity: 3 },
            { label: 'regular', quantity: 2 },
            { label: 'ruim', quantity: 1 },
          ],
        },
        {
          id: 'question-b',
          surveyId: 'survey',
          question: 'Você agendou um novo atendimento?',
          answers: [
            { label: 'bom', quantity: 3 },
            { label: 'regular', quantity: 2 },
            { label: 'ruim', quantity: 1 },
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
        { id: mockQuestionId2, question: 'Question 2', order: 2 }
      ]
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
      nextQuestion: 'Question 2',
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
        { id: mockQuestionId2, question: 'Question 2', order: 2 }
      ]
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
