import { Test, TestingModule } from '@nestjs/testing';
import { HookService } from './hook.service';
import { TwilioService } from '../../client/twilio/twilio.service';
import { mockReceivedMessage } from '../../__mocks__/receivedMessage.mock';
import { SurveyService } from '../../survey/service/survey.service';
import { randomUUID } from 'crypto';
import { CustomerService } from '../../customer/service/customer.service';

describe('HookService', () => {
  let service: HookService;
  let mockTwilioService: TwilioService;
  let mockSurveyService: SurveyService;
  let mockCustomerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HookService,
        {
          provide: TwilioService,
          useValue: {
            replyToUser: jest.fn(),
            sendFirstMessage: jest.fn(),
          },
        },
        {
          provide: CustomerService,
          useValue: {
            getCustomersBySurveyId: jest.fn(),
          },
        },
        {
          provide: SurveyService,
          useValue: {
            addAnswerToSurvey: jest.fn(),
            getFirstQuestionBySurveyId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HookService>(HookService);
    mockTwilioService = module.get<TwilioService>(TwilioService);
    mockSurveyService = module.get<SurveyService>(SurveyService);
    mockCustomerService = module.get<CustomerService>(CustomerService);
  });

  it('should send message replyMessage with next question when customerAnswers is less than surveyLength', async () => {
    const mockReplyToUser = jest
      .spyOn(mockTwilioService, 'replyToUser')
      .mockImplementation(() =>
        Promise.resolve({
          body: 'Next question',
          direction: 'outbound-api',
          from: 'whatsapp:+12345678900',
          to: 'whatsapp:+5511988885555',
          dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
          status: 'queued',
          sid: 'FMsGH890912dasb',
        }),
      );
    const mockUpdate = jest
      .spyOn(mockSurveyService, 'addAnswerToSurvey')
      .mockImplementation(() =>
        Promise.resolve({
          answerReceived: {
            id: randomUUID(),
            customerId: randomUUID(),
            questionId: randomUUID(),
            answer: 'bom',
          },
          nextQuestion: 'Next Question \n1 - bom\n2 - regular\n3 - ruim',
        }),
      );

    const mockMessage = mockReceivedMessage({
      body: '1',
      profileName: 'Ada Lovelace',
      to: 'whatsapp:+12345678900',
      waId: '5511988885555',
      smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
      accountSid: '50M34c01quertacggd9876',
    });

    const response = await service.sendMessage(mockMessage);
    expect(mockReplyToUser).toHaveBeenCalledWith({
      message: mockMessage,
      isValid: true,
      replyMessage: 'Next Question \n1 - bom\n2 - regular\n3 - ruim',
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      answer: '1',
      customer: '5511988885555',
    });
    expect(response).toMatchObject({
      body: 'Next question',
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb',
    });
  });

  it('should send message replyMessage null when customerAnswers is equal than surveyLength', async () => {
    const mockReplyToUser = jest
      .spyOn(mockTwilioService, 'replyToUser')
      .mockImplementation(() =>
        Promise.resolve({
          body: 'Obrigada pela sua resposta',
          direction: 'outbound-api',
          from: 'whatsapp:+12345678900',
          to: 'whatsapp:+5511988885555',
          dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
          status: 'queued',
          sid: 'FMsGH890912dasb',
        }),
      );
    const mockUpdate = jest
      .spyOn(mockSurveyService, 'addAnswerToSurvey')
      .mockImplementation(() =>
        Promise.resolve({
          answerReceived: {
            id: randomUUID(),
            customerId: randomUUID(),
            questionId: randomUUID(),
            answer: 'bom',
          },
          nextQuestion: null,
        }),
      );

    const mockMessage = mockReceivedMessage({
      body: '1',
      profileName: 'Ada Lovelace',
      to: 'whatsapp:+12345678900',
      waId: '5511988885555',
      smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
      accountSid: '50M34c01quertacggd9876',
    });

    const response = await service.sendMessage(mockMessage);
    expect(mockReplyToUser).toHaveBeenCalledWith({
      message: mockMessage,
      isValid: true,
      replyMessage: null,
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      answer: '1',
      customer: '5511988885555',
    });
    expect(response).toMatchObject({
      body: 'Obrigada pela sua resposta',
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb',
    });
  });

  it('should return failed response when send message with invalid content', async () => {
    const mockReplyToUser = jest
      .spyOn(mockTwilioService, 'replyToUser')
      .mockImplementation(() =>
        Promise.resolve({
          body: 'Por favor responda apenas com o número de uma das alternativas',
          direction: 'outbound-api',
          from: 'whatsapp:+12345678900',
          to: 'whatsapp:+5511988885555',
          dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
          status: 'queued',
          sid: 'FMsGH890912dasb',
        }),
      );
    const mockMessage = mockReceivedMessage({
      body: 'Invalid',
      profileName: 'Ada Lovelace',
      to: 'whatsapp:+12345678900',
      waId: '5511988885555',
      smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
      accountSid: '50M34c01quertacggd9876',
    });

    const response = await service.sendMessage(mockMessage);
    expect(mockReplyToUser).toHaveBeenCalledWith({
      message: mockMessage,
      isValid: false,
      replyMessage: null,
    });
    expect(response).toMatchObject({
      body: 'Por favor responda apenas com o número de uma das alternativas',
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb',
    });
  });

  it('should send survey to registered customers', async () => {
    const mockSurveyId = randomUUID();
    const mockCompanyId = randomUUID();
    const mockCustomerId = randomUUID();
    const mockCustomerId2 = randomUUID();

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
      {
        id: randomUUID(),
        customerId: mockCustomerId2,
        surveyId: mockSurveyId,
        active: true,
        customer: {
          id: mockCustomerId2,
          name: 'Grace Hooper',
          phoneNumber: '5511999991111',
          companyId: mockCompanyId,
          answers: [],
        },
      },
    ];
    const mockGetCustomer = jest
      .spyOn(mockCustomerService, 'getCustomersBySurveyId')
      .mockImplementation(() => Promise.resolve(mockCustomerSurvey));
    const mockGetFirstQuestion = jest
      .spyOn(mockSurveyService, 'getFirstQuestionBySurveyId')
      .mockImplementation(() =>
        Promise.resolve({
          question: 'Question \n1 - Bom\n2 - Regular\n3 - Ruim',
        }),
      );

    const response = await service.sendSurvey(mockSurveyId);
    expect(mockGetCustomer).toHaveBeenCalledWith(mockSurveyId);
    expect(mockGetFirstQuestion).toHaveBeenCalledWith(mockSurveyId);
    mockCustomerSurvey.map((survey) => {
      const mockSendFirstMessage = jest
        .spyOn(mockTwilioService, 'sendFirstMessage')
        .mockImplementation(() =>
          Promise.resolve({
            body: 'Question \n1 - Bom\n2 - Regular\n3 - Ruim',
            direction: 'outbound-api',
            from: 'whatsapp:+12345678900',
            to: `whatsapp:+${survey.customer.phoneNumber}`,
            dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
            status: 'queued',
            sid: 'FMsGH890912dasb',
          }),
        );
      expect(mockSendFirstMessage).toHaveBeenCalledWith({
        customerPhone: survey.customer.phoneNumber,
        body: 'Question \n1 - Bom\n2 - Regular\n3 - Ruim',
      });
    });
    expect(response).toMatchObject({
      surveySent: {
        surveyId: mockSurveyId,
        status: 'sent',
        totalCustomers: 2,
      },
    });
  });
});
