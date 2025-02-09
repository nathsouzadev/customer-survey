import { Test, TestingModule } from '@nestjs/testing';
import { HookController } from './hook.controller';
import { HookService } from '../hook/service/hook.service';
import { mockReceivedMessageFromMeta } from '../__mocks__/metaReceivedMessage.mock';
import { SurveyService } from '../survey/service/survey.service';
import { CustomerAnswerRepository } from '../customer/repository/customerAnswer.repository';
import { CustomerService } from '../customer/service/customer.service';
import { CustomerRepository } from '../customer/repository/customer.repository';
import { CustomerSurveyRepository } from '../customer/repository/customerSurvey.repository';
import { SurveyRepository } from '../survey/repository/survey.repository';
import { AppLogger } from '../utils/appLogger';
import { QuestionRepository } from '../survey/repository/question.repository';
import { randomUUID } from 'crypto';
import { WBService } from '../client/wb/wb.service';
import { UnauthorizedException } from '@nestjs/common';
import { CompanyRepository } from '../company/repository/company.repository';
import { CompanyService } from '../company/service/company.service';
import { PhoneCompanyRepository } from '../company/repository/phoneCompany.repository';
import { SenderRepository } from '../sender/repository/sender.repository';
import { SenderService } from '../sender/service/sender.service';

describe('HookController', () => {
  let hookController: HookController;
  let mockHookService: HookService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HookController],
      providers: [
        HookService,
        SurveyService,
        CompanyService,
        SenderService,
        {
          provide: WBService,
          useValue: {},
        },
        CustomerService,
        {
          provide: CustomerRepository,
          useValue: {},
        },
        {
          provide: CustomerAnswerRepository,
          useValue: {},
        },
        {
          provide: CustomerSurveyRepository,
          useValue: {},
        },
        {
          provide: SurveyRepository,
          useValue: {},
        },
        {
          provide: QuestionRepository,
          useValue: {},
        },
        {
          provide: CompanyRepository,
          useValue: {},
        },
        {
          provide: PhoneCompanyRepository,
          useValue: {},
        },
        {
          provide: SenderRepository,
          useValue: {},
        },
        AppLogger,
      ],
    }).compile();

    hookController = app.get<HookController>(HookController);
    mockHookService = app.get<HookService>(HookService);
  });

  describe('hook', () => {
    it('should return message after sent', async () => {
      const mockHandler = jest
        .spyOn(mockHookService, 'handlerMessage')
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

      const response = await hookController.getMessage(mockMessage);
      expect(mockHandler).toHaveBeenCalledWith(mockMessage);
      expect(response).toMatchObject({
        status: 'ok',
        response: {
          messageId:
            'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
        },
      });
    });
  });

  describe('send survey', () => {
    it('should send survey to customers', async () => {
      const mockSurveyId = randomUUID();
      const mockCompanyId = randomUUID();
      const mockCompanyName = 'Company';
      const mockSendSurvey = jest
        .spyOn(mockHookService, 'sendSurvey')
        .mockImplementation(() =>
          Promise.resolve({
            surveySent: {
              surveyId: mockSurveyId,
              status: 'sent',
              totalCustomers: 2,
            },
          }),
        );

      const response = await hookController.sendSurvey(
        {
          headers: {},
        },
        mockSurveyId,
        {
          companyId: mockCompanyId,
          name: mockCompanyName,
        },
      );
      expect(mockSendSurvey).toHaveBeenCalledWith({
        surveyId: mockSurveyId,
        companyId: mockCompanyId,
        name: mockCompanyName,
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

  describe('validate webhook', () => {
    it('should activate webhook', async () => {
      const mockToken = randomUUID();
      const mockChallenge = randomUUID();
      process.env.WEBHOOK_TOKEN = mockToken;
      const response = await hookController.activate({
        query: {
          'hub.verify_token': mockToken,
          'hub.challenge': mockChallenge,
        },
      });
      expect(response).toBe(mockChallenge);
    });

    it('should throw a erro if has invalid token', async () => {
      const mockToken = randomUUID();
      const mockChallenge = randomUUID();
      process.env.WEBHOOK_TOKEN = mockToken;
      expect(
        hookController.activate({
          query: {
            'hub.verify_token': randomUUID(),
            'hub.challenge': mockChallenge,
          },
        }),
      ).rejects.toThrow(new UnauthorizedException());
    });
  });

  it('should return messageId when sender sent survey', async () => {
    const mockSend = jest
      .spyOn(mockHookService, 'sendSurveyFromSender')
      .mockImplementation(() =>
        Promise.resolve({
          messageId:
            'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
        }),
      );
    const mockSenderRequest = {
      companyId: randomUUID(),
      email: 'sender@email.com',
      phoneNumber: '11999998888',
    };

    const response = await hookController.sendSurveyFromSender(
      {
        headers: {},
      },
      mockSenderRequest,
    );
    expect(mockSend).toHaveBeenCalledWith(mockSenderRequest);
    expect(response).toMatchObject({
      messageId:
        'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
    });
  });
});
