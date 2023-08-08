import { Test, TestingModule } from '@nestjs/testing';
import { HookService } from './hook.service';
import { SurveyService } from '../../survey/service/survey.service';
import { randomUUID } from 'crypto';
import { CustomerService } from '../../customer/service/customer.service';
import { WBService } from '../../client/wb/wb.service';
import { CompanyService } from '../../company/service/company.service';
import { mockReceivedMessage } from '../../__mocks__/receivedMessage.mock';
import { getSurveyTemplate } from '../templates/survey.template';
import { mockQuickReplyReceived } from '../../__mocks__/quickReplyReceived.mock';
import { mockReceivedMessageFromMeta } from '../../__mocks__/metaReceivedMessage.mock';
import { SenderService } from '../../sender/service/sender.service';
import { getMockCompanyModel } from '../../__mocks__/companyModel.mock';

describe('HookService', () => {
  let service: HookService;
  let mockSurveyService: SurveyService;
  let mockCustomerService: CustomerService;
  let mockWbService: WBService;
  let mockCompanyService: CompanyService;
  let mockSenderService: SenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HookService,
        {
          provide: CustomerService,
          useValue: {
            getCustomersBySurveyId: jest.fn(),
            getSurvey: jest.fn(),
            registerCustomerSurvey: jest.fn(),
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
            getPhoneWithSurvey: jest.fn(),
            getCompanyByEmailOrId: jest.fn(),
          },
        },
        {
          provide: SenderService,
          useValue: {
            validateSender: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HookService>(HookService);
    mockSurveyService = module.get<SurveyService>(SurveyService);
    mockCustomerService = module.get<CustomerService>(CustomerService);
    mockWbService = module.get<WBService>(WBService);
    mockCompanyService = module.get<CompanyService>(CompanyService);
    mockSenderService = module.get<SenderService>(SenderService);
  });

  describe('handler message', () => {
    it('should return message after sent', async () => {
      const mockSend = jest
        .spyOn(service, 'sendMessage')
        .mockImplementation(() =>
          Promise.resolve({
            messageId:
              'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
          }),
        );
      const mockMessage = mockReceivedMessageFromMeta({
        message: '1',
        receiver: '12345678900',
        sender: '5511988885555',
        type: 'message',
      });
      const mockMessageData = mockMessage.entry[0].changes[0].value;

      const response = await service.handlerMessage(mockMessage);
      expect(mockSend).toHaveBeenCalledWith(mockMessageData);
      expect(response).toMatchObject({
        messageId:
          'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
      });
    });

    it('should return message after receive message "Responder pesquisa"', async () => {
      const mockRegister = jest
        .spyOn(service, 'registerCustomerToSurvey')
        .mockImplementation(() =>
          Promise.resolve({
            messageId:
              'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
          }),
        );
      const mockMessage = mockReceivedMessageFromMeta({
        message: 'Responder pesquisa',
        receiver: '12345678900',
        sender: '5511988885555',
        type: 'message',
      });
      const mockMessageData = mockMessage.entry[0].changes[0].value;

      const response = await service.handlerMessage(mockMessage);
      expect(mockRegister).toHaveBeenCalledWith(mockMessageData);
      expect(response).toMatchObject({
        messageId:
          'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
      });
    });

    it('should return message after receive quickReply', async () => {
      const mockReceivedOptin = jest
        .spyOn(service, 'receiveOptinFromCustomer')
        .mockImplementation(() =>
          Promise.resolve({
            messageId:
              'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
          }),
        );
      const mockMessage = mockReceivedMessageFromMeta({
        message: 'Quero participar',
        receiver: '12345678900',
        sender: '5511988885555',
        type: 'quickReply',
      });
      const mockMessageData = mockMessage.entry[0].changes[0].value;

      const response = await service.handlerMessage(mockMessage);
      expect(mockReceivedOptin).toHaveBeenCalledWith(mockMessageData);
      expect(response).toMatchObject({
        messageId:
          'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
      });
    });
  });

  it('send first question after receive opt in from customer', async () => {
    const mockCustomerPhoneNumber = '5511988885555';
    const mockCompanyPhoneNumber = '12345678900';
    const mockPhoneNumberId = `1234567890`;
    const mockCustomerId = randomUUID();
    const mockSurveyId = randomUUID();
    const mockCompanyId = randomUUID();
    const mockMessageReceived = mockQuickReplyReceived({
      message: 'Participar da pesquisa',
      receiver: mockCompanyPhoneNumber,
      sender: mockCustomerPhoneNumber,
      phoneNumberId: mockPhoneNumberId,
    });

    const mockGetSurvey = jest
      .spyOn(mockCustomerService, 'getSurvey')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          active: true,
          customerId: mockCustomerId,
          surveyId: mockSurveyId,
          survey: {
            id: mockSurveyId,
            name: 'Survey',
            title: 'Survey title',
            companyId: mockCompanyId,
            questions: [],
          },
        }),
      );
    const mockSendFirstQuestion = jest
      .spyOn(service, 'sendFirstQuestionFromSurvey')
      .mockImplementation(() =>
        Promise.resolve({
          messageId:
            'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
        }),
      );

    const response = await service.receiveOptinFromCustomer(
      mockMessageReceived,
    );
    expect(mockGetSurvey).toHaveBeenCalledWith(mockCustomerPhoneNumber);
    expect(mockSendFirstQuestion).toHaveBeenCalledWith({
      sender: mockCompanyPhoneNumber,
      receiver: mockCustomerPhoneNumber,
      phoneNumberId: mockPhoneNumberId,
      surveyId: mockSurveyId,
    });
    expect(response).toMatchObject({
      messageId:
        'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
    });
  });

  describe('send message', () => {
    it('should send message replyMessage with next question when customerAnswers is less than surveyLength', async () => {
      const mockSenderPhone = '5511988885555';
      const mockReceiverPhone = '5511999991110';
      const mockPhoneNumberId = `1234567890`;
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
        phoneNumberId: mockPhoneNumberId,
      });

      const response = await service.sendMessage(mockMessage);
      expect(mockReplyToUser).toHaveBeenCalledWith({
        sender: mockReceiverPhone,
        receiver: mockSenderPhone,
        message: 'Next Question \n1 - bom\n2 - regular\n3 - ruim',
        phoneNumberId: mockPhoneNumberId,
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
      const mockPhoneNumberId = `1234567890`;
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
        phoneNumberId: mockPhoneNumberId,
      });

      const response = await service.sendMessage(mockMessage);
      expect(mockReplyToUser).toHaveBeenCalledWith({
        sender: mockReceiverPhone,
        receiver: mockSenderPhone,
        message: 'Obrigada pela sua resposta!',
        phoneNumberId: mockPhoneNumberId,
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
      const mockPhoneNumberId = `1234567890`;
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
        phoneNumberId: mockPhoneNumberId,
      });

      const response = await service.sendMessage(mockMessage);
      expect(mockReplyToUser).toHaveBeenCalledWith({
        sender: mockReceiverPhone,
        receiver: mockSenderPhone,
        message:
          'Por favor responda apenas com o número de uma das alternativas',
        phoneNumberId: mockPhoneNumberId,
      });
      expect(response).toMatchObject({
        messageId:
          'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
      });
    });
  });

  describe('send survey', () => {
    it('should send survey to registered customers', async () => {
      const mockSurveyId = randomUUID();
      const mockCompanyId = randomUUID();
      const mockCompanyName = 'Company';
      const mockCustomerId = randomUUID();
      const mockCustomerId2 = randomUUID();
      const mockCompanyPhone = '5511999995555';
      const mockPhoneNumberId = `1234567890`;

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
            metaId: mockPhoneNumberId,
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
        name: mockCompanyName,
      });
      expect(mockGetCustomer).toHaveBeenCalledWith(mockSurveyId);
      expect(mockGetFirstQuestion).not.toHaveBeenCalledWith(mockSurveyId);
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
        expect(mockSendTemplate).toHaveBeenCalledWith(
          getSurveyTemplate({
            receiver: survey.customer.phoneNumber,
            sender: mockCompanyPhone,
            company: mockCompanyName,
            phoneNumberId: mockPhoneNumberId,
          }),
        );
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
      const mockCompanyName = 'Company';

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
        name: mockCompanyName,
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

  it('should register customer with survey from company', async () => {
    const mockSenderPhone = '5511988885555';
    const mockReceiverPhone = '5511999991110';
    const mockPhoneNumberId = `1234567890`;
    const mockCompanyId = randomUUID();
    const mockSurveyId = randomUUID();
    const mockMessage = mockReceivedMessage({
      name: 'Ada Lovelace',
      sender: mockSenderPhone,
      receiver: mockReceiverPhone,
      message: 'teste',
      phoneNumberId: mockPhoneNumberId,
    });

    const mockGetSurvey = jest
      .spyOn(mockCompanyService, 'getPhoneWithSurvey')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          active: true,
          phoneNumber: mockReceiverPhone,
          companyId: mockCompanyId,
          metaId: '1234567890',
          company: {
            id: mockCompanyId,
            active: true,
            name: 'Company',
            email: 'company@email.com',
            surveys: [
              {
                id: mockSurveyId,
                companyId: mockCompanyId,
                name: 'Survey',
                title: 'Survey Title',
                questions: [],
              },
            ],
          },
        }),
      );
    const mockRegisterCustomer = jest
      .spyOn(mockCustomerService, 'registerCustomerSurvey')
      .mockImplementation(() => Promise.resolve());
    const mockSendFirstQuestion = jest
      .spyOn(service, 'sendFirstQuestionFromSurvey')
      .mockImplementation(() =>
        Promise.resolve({
          messageId:
            'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
        }),
      );

    const response = await service.registerCustomerToSurvey(mockMessage);
    expect(mockGetSurvey).toHaveBeenCalledWith(mockReceiverPhone);
    expect(mockRegisterCustomer).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      phoneNumber: mockSenderPhone,
      surveyId: mockSurveyId,
      companyId: mockCompanyId,
    });
    expect(mockSendFirstQuestion).toHaveBeenCalledWith({
      sender: mockReceiverPhone,
      receiver: mockSenderPhone,
      phoneNumberId: mockPhoneNumberId,
      surveyId: mockSurveyId,
    });
    expect(response).toMatchObject({
      messageId:
        'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
    });
  });

  it('should send first question from survey', async () => {
    const mockCompanyPhoneNumber = '5511999998888';
    const mockCustomerPhoneNumber = '5511999991234';
    const mockQuestion = 'Question 1';
    const mockPhoneNumberId = '1234567890';
    const mockSurveyId = randomUUID();

    const mockGetFirstQuestion = jest
      .spyOn(mockSurveyService, 'getFirstQuestionBySurveyId')
      .mockImplementation(() => Promise.resolve({ question: mockQuestion }));
    const mockSend = jest
      .spyOn(mockWbService, 'sendMessage')
      .mockImplementation(() =>
        Promise.resolve({
          messaging_product: 'whatsapp',
          contacts: [
            {
              input: mockCompanyPhoneNumber,
              wa_id: mockCompanyPhoneNumber,
            },
          ],
          messages: [
            {
              id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          ],
        }),
      );
    const response = await service.sendFirstQuestionFromSurvey({
      sender: mockCompanyPhoneNumber,
      receiver: mockCustomerPhoneNumber,
      phoneNumberId: mockPhoneNumberId,
      surveyId: mockSurveyId,
    });
    expect(mockGetFirstQuestion).toHaveBeenCalledWith(mockSurveyId);
    expect(mockSend).toHaveBeenCalledWith({
      sender: mockCompanyPhoneNumber,
      receiver: mockCustomerPhoneNumber,
      message: mockQuestion,
      phoneNumberId: mockPhoneNumberId,
    });
    expect(response).toMatchObject({
      messageId:
        'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
    });
  });

  it('should send template message from sender', async () => {
    const mockCompanyId = randomUUID();
    const mockSenderEmail = 'sender@email.com';
    const mockPhoneNumber = '11999991111';
    const mockValidate = jest
      .spyOn(mockSenderService, 'validateSender')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          email: mockSenderEmail,
          companyId: mockCompanyId,
          name: 'Sender',
        }),
      );
    const mockCompany = getMockCompanyModel(mockCompanyId);
    const mockGetCompany = jest
      .spyOn(mockCompanyService, 'getCompanyByEmailOrId')
      .mockImplementation(() => Promise.resolve(mockCompany));
    const mockSendTemplate = jest
      .spyOn(mockWbService, 'sendMessage')
      .mockImplementation(() =>
        Promise.resolve({
          messaging_product: 'whatsapp',
          contacts: [
            {
              input: mockCompany.phoneNumbers[0].phoneNumber,
              wa_id: mockCompany.phoneNumbers[0].phoneNumber,
            },
          ],
          messages: [
            {
              id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          ],
        }),
      );

    const response = await service.sendSurveyFromSender({
      companyId: mockCompanyId,
      email: mockSenderEmail,
      phoneNumber: mockPhoneNumber,
    });
    expect(mockValidate).toHaveBeenCalledWith({
      companyId: mockCompanyId,
      email: mockSenderEmail,
    });
    expect(mockGetCompany).toHaveBeenCalledWith(mockCompanyId);
    expect(mockSendTemplate).toHaveBeenCalledWith(
      getSurveyTemplate({
        receiver: '5511999991111',
        sender: mockCompany.phoneNumbers[0].phoneNumber,
        company: mockCompany.name,
        phoneNumberId: mockCompany.phoneNumbers[0].metaId,
      }),
    );
    expect(response).toMatchObject({
      messageId:
        'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
    });
  });
});
