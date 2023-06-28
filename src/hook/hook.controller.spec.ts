import { Test, TestingModule } from '@nestjs/testing';
import { HookController } from './hook.controller';
import { HookService } from '../hook/service/hook.service';
import { TwilioService } from '../client/twilio/twilio.service';
import { mockReceivedMessage } from '../__mocks__/metaReceivedMessage.mock';
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

describe('HookController', () => {
  let hookController: HookController;
  let mockHookService: HookService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HookController],
      providers: [
        HookService,
        SurveyService,
        {
          provide: TwilioService,
          useValue: {},
        },
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
        AppLogger,
      ],
    }).compile();

    hookController = app.get<HookController>(HookController);
    mockHookService = app.get<HookService>(HookService);
  });

  describe('root', () => {
    it('should return message after sent', async () => {
      jest.spyOn(mockHookService, 'sendMessage').mockImplementation(() =>
        Promise.resolve({
          messageId:
            'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
        }),
      );

      const response = await hookController.getMessage(
        mockReceivedMessage({
          message: '1',
          receiver: '12345678900',
          sender: '5511988885555',
        }),
      );

      expect(response).toMatchObject({
        status: 'ok',
        response: {
          messageId:
            'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
        },
      });
    });
  });

  it('should send survey to customers', async () => {
    const mockSurveyId = randomUUID();
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
    );
    expect(mockSendSurvey).toHaveBeenCalledWith(mockSurveyId);
    expect(response).toMatchObject({
      surveySent: {
        surveyId: mockSurveyId,
        status: 'sent',
        totalCustomers: 2,
      },
    });
  });

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
