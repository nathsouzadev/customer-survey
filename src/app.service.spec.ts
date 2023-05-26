import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { TwilioService } from './client/twilio.service';
import { mockReceivedMessage } from './__mocks__/receivedMessage.mock';

describe('AppService', () => {
  let service: AppService;
  let mockTwilioService: TwilioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
          AppService,
          {
            provide: TwilioService,
            useValue: {
              sendToTwilio: jest.fn(),
            },
          }
        ],
      }).compile();

      service = module.get<AppService>(AppService);
      mockTwilioService = module.get<TwilioService>(TwilioService);
  })

  it('should return response when send message', async() => {
    jest.spyOn(mockTwilioService, 'sendToTwilio').mockImplementation(() => Promise.resolve({
      body: 'Sample message',
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb'
    }));

    const response = await service.sendMessage(mockReceivedMessage({
      profileName: 'Ada Lovelace',
      to: 'whatsapp:+12345678900',
      waId: '5511988885555',
      smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
      accountSid: '50M34c01quertacggd9876'
    }))

    expect(response).toMatchObject({
      body: 'Sample message',
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb'
    })
  })
});
