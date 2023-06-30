import { Test, TestingModule } from '@nestjs/testing';
import { HookService } from './hook.service';
import { mockReceivedMessage } from '../../__mocks__/metaReceivedMessage.mock';
import { SurveyService } from '../../survey/service/survey.service';
import { randomUUID } from 'crypto';
import { CustomerService } from '../../customer/service/customer.service';
import { WBService } from '../../client/wb/wb.service';
import { CompanyService } from '../../company/service/company.service';

describe('HookService', () => {
  let service: HookService;
  let mockSurveyService: SurveyService;
  let mockCustomerService: CustomerService;
  let mockWbService: WBService;
  let mockCompanyService: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HookService,
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
        {
          provide: WBService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
        {
          provide: CompanyService,
          useValue: {
            getPhoneByCompanyId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HookService>(HookService);
    mockSurveyService = module.get<SurveyService>(SurveyService);
    mockCustomerService = module.get<CustomerService>(CustomerService);
    mockWbService = module.get<WBService>(WBService);
    mockCompanyService = module.get<CompanyService>(CompanyService);
  });

  it('should send message replyMessage with next question when customerAnswers is less than surveyLength', async () => {
    const mockSenderPhone = '5511988885555';
    const mockReceiverPhone = '5511999991110';
    const mockReplyToUser = jest
      .spyOn(mockWbService, 'sendMessage')
      .mockImplementation(() =>
        Promise.resolve({
          messaging_product: 'whatsapp',
          contacts: [
            {
              input: mockReceiverPhone,
              wa_id: mockReceiverPhone,
            },
          ],
          messages: [
            {
              id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          ],
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
      sender: mockSenderPhone,
      receiver: mockReceiverPhone,
      message: '1',
    });

    const response = await service.sendMessage(mockMessage);
    expect(mockReplyToUser).toHaveBeenCalledWith({
      sender: mockReceiverPhone,
      receiver: mockSenderPhone,
      message: 'Next Question \n1 - bom\n2 - regular\n3 - ruim',
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      answer: '1',
      customer: '5511988885555',
    });
    expect(response).toMatchObject({
      messageId:
        'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
    });
  });

  it('should send message replyMessage null when customerAnswers is equal than surveyLength', async () => {
    const mockSenderPhone = '5511988885555';
    const mockReceiverPhone = '5511999991110';
    const mockReplyToUser = jest
      .spyOn(mockWbService, 'sendMessage')
      .mockImplementation(() =>
        Promise.resolve({
          messaging_product: 'whatsapp',
          contacts: [
            {
              input: mockReceiverPhone,
              wa_id: mockReceiverPhone,
            },
          ],
          messages: [
            {
              id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          ],
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
      sender: mockSenderPhone,
      receiver: mockReceiverPhone,
      message: '1',
    });

    const response = await service.sendMessage(mockMessage);
    expect(mockReplyToUser).toHaveBeenCalledWith({
      sender: mockReceiverPhone,
      receiver: mockSenderPhone,
      message: 'Obrigada pela sua resposta!',
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      answer: '1',
      customer: '5511988885555',
    });
    expect(response).toMatchObject({
      messageId:
        'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
    });
  });

  it('should return failed response when send message with invalid content', async () => {
    const mockSenderPhone = '5511988885555';
    const mockReceiverPhone = '5511999991110';
    const mockReplyToUser = jest
      .spyOn(mockWbService, 'sendMessage')
      .mockImplementation(() =>
        Promise.resolve({
          messaging_product: 'whatsapp',
          contacts: [
            {
              input: mockReceiverPhone,
              wa_id: mockReceiverPhone,
            },
          ],
          messages: [
            {
              id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          ],
        }),
      );
    const mockMessage = mockReceivedMessage({
      sender: mockSenderPhone,
      receiver: mockReceiverPhone,
      message: 'teste',
    });

    const response = await service.sendMessage(mockMessage);
    expect(mockReplyToUser).toHaveBeenCalledWith({
      sender: mockReceiverPhone,
      receiver: mockSenderPhone,
      message: 'Por favor responda apenas com o número de uma das alternativas',
    });
    expect(response).toMatchObject({
      messageId:
        'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
    });
  });

  it('should send survey to registered customers', async () => {
    const mockSurveyId = randomUUID();
    const mockCompanyId = randomUUID();
    const mockCustomerId = randomUUID();
    const mockCustomerId2 = randomUUID();
    const mockCompanyPhone = '5511999995555';

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
          phoneNumber: '5511999991112',
          companyId: mockCompanyId,
          answers: [],
        },
      },
    ];
    const mockGetCustomer = jest
      .spyOn(mockCustomerService, 'getCustomersBySurveyId')
      .mockImplementation(() => Promise.resolve(mockCustomerSurvey));
    const mockGetPhone = jest
      .spyOn(mockCompanyService, 'getPhoneByCompanyId')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          active: true,
          companyId: mockCompanyId,
          phoneNumber: mockCompanyPhone,
        }),
      );
    const mockGetFirstQuestion = jest
      .spyOn(mockSurveyService, 'getFirstQuestionBySurveyId')
      .mockImplementation(() =>
        Promise.resolve({
          question: 'Question \n1 - Bom\n2 - Regular\n3 - Ruim',
        }),
      );

    const response = await service.sendSurvey({
      surveyId: mockSurveyId,
      companyId: mockCompanyId,
    });
    expect(mockGetCustomer).toHaveBeenCalledWith(mockSurveyId);
    expect(mockGetFirstQuestion).toHaveBeenCalledWith(mockSurveyId);
    expect(mockGetPhone).toHaveBeenCalledWith(mockCompanyId);
    mockCustomerSurvey.map((survey) => {
      const mockSendTemplate = jest
        .spyOn(mockWbService, 'sendMessage')
        .mockImplementation(() =>
          Promise.resolve({
            messaging_product: 'whatsapp',
            contacts: [
              {
                input: survey.customer.phoneNumber,
                wa_id: survey.customer.phoneNumber,
              },
            ],
            messages: [
              {
                id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
              },
            ],
          }),
        );
      const mockSendQuestion = jest
        .spyOn(mockWbService, 'sendMessage')
        .mockImplementation(() =>
          Promise.resolve({
            messaging_product: 'whatsapp',
            contacts: [
              {
                input: survey.customer.phoneNumber,
                wa_id: survey.customer.phoneNumber,
              },
            ],
            messages: [
              {
                id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MBB=',
              },
            ],
          }),
        );
      expect(mockSendTemplate).toHaveBeenCalledWith({
        receiver: survey.customer.phoneNumber,
        sender: mockCompanyPhone,
        type: 'template',
        template: 'hello_world',
      });
      expect(mockSendQuestion).toHaveBeenCalledWith({
        receiver: survey.customer.phoneNumber,
        sender: mockCompanyPhone,
        message: 'Question \n1 - Bom\n2 - Regular\n3 - Ruim',
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

  it('should not send survey when not have registered customers', async () => {
    const mockSurveyId = randomUUID();
    const mockCompanyId = randomUUID();

    const mockGetCustomer = jest
      .spyOn(mockCustomerService, 'getCustomersBySurveyId')
      .mockImplementation(() => Promise.resolve([]));
    const mockGetFirstQuestion = jest.spyOn(
      mockSurveyService,
      'getFirstQuestionBySurveyId',
    );

    const response = await service.sendSurvey({
      surveyId: mockSurveyId,
      companyId: mockCompanyId,
    });
    expect(mockGetCustomer).toHaveBeenCalledWith(mockSurveyId);
    expect(mockGetFirstQuestion).not.toHaveBeenCalled();
    expect(response).toMatchObject({
      surveySent: {
        surveyId: mockSurveyId,
        status: 'no-customers',
        totalCustomers: 0,
      },
    });
  });
});
