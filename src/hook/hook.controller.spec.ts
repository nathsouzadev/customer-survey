import { Test, TestingModule } from '@nestjs/testing';
import { HookController } from './hook.controller';
import { HookService } from '../hook/service/hook.service';
import { TwilioService } from '../client/twilio.service';
import { mockReceivedMessage } from '../__mocks__/receivedMessage.mock';
import { SurveyService } from '../survey/service/survey.service';

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
});
