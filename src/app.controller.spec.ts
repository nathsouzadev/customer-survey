import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwilioService } from './client/twilio.service';
import { mockReceivedMessage } from './__mocks__/receivedMessage.mock';

describe('AppController', () => {
  let appController: AppController;
  let mockAppService: AppService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: TwilioService,
          useValue: {}
        }
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    mockAppService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      jest.spyOn(mockAppService, 'sendMessage').mockImplementation(() => Promise.resolve({
        body: 'Sample message',
        direction: 'outbound-api',
        from: 'whatsapp:+12345678900',
        to: 'whatsapp:+5511988885555',
        dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
        status: 'queued',
        sid: 'FMsGH890912dasb'
      }))

      const response = await appController.getMessage(mockReceivedMessage({
        profileName: 'Ada Lovelace',
        to: 'whatsapp:+12345678900',
        waId: '5511988885555',
        smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
        accountSid: '50M34c01quertacggd9876'
      }))

      expect(response).toMatchObject({
        status: 'ok',
        response: {
          body: 'Sample message',
          direction: 'outbound-api',
          from: 'whatsapp:+12345678900',
          to: 'whatsapp:+5511988885555',
          dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
          status: 'queued',
          sid: 'FMsGH890912dasb'
        }
      });
    });
  });
});
