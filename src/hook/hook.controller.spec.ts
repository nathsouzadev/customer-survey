import { Test, TestingModule } from '@nestjs/testing';
import { HookController } from './hook.controller';
import { HookService } from '../hook/service/hook.service';
import { TwilioService } from '../client/twilio/twilio.service';
import { mockReceivedMessage } from '../__mocks__/receivedMessage.mock';
import { SurveyService } from '../survey/service/survey.service';
import { CustomerAnswerRepository } from '../customer/repository/customerAnswer.repository';
import { CustomerService } from '../customer/service/customer.service';
import { CustomerRepository } from '../customer/repository/customer.repository';
import { CustomerSurveyRepository } from '../customer/repository/customerSurvey.repository';
import { SurveyRepository } from '../survey/repository/survey.repository';
import { AppLogger } from '../utils/appLogger';
import { QuestionRepository } from '../survey/repository/question.repository';
import { randomUUID } from 'crypto';

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
          body: '1',
          direction: 'outbound-api',
          from: 'whatsapp:+12345678900',
          to: 'whatsapp:+5511988885555',
          dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
          status: 'queued',
          sid: 'FMsGH890912dasb',
        }),
      );

      const response = await hookController.getMessage(
        mockReceivedMessage({
          body: '1',
          profileName: 'Ada Lovelace',
          to: 'whatsapp:+12345678900',
          waId: '5511988885555',
          smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
          accountSid: '50M34c01quertacggd9876',
        }),
      );

      expect(response).toMatchObject({
        status: 'ok',
        response: {
          body: '1',
          direction: 'outbound-api',
          from: 'whatsapp:+12345678900',
          to: 'whatsapp:+5511988885555',
          dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
          status: 'queued',
          sid: 'FMsGH890912dasb',
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
});
