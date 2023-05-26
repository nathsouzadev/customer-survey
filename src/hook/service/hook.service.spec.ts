import { Test, TestingModule } from '@nestjs/testing';
import { HookService } from './hook.service';
import { TwilioService } from '../../client/twilio.service';
import { mockReceivedMessage } from '../../__mocks__/receivedMessage.mock';

describe('HookService', () => {
  let service: HookService;
  let mockTwilioService: TwilioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
          HookService,
          {
            provide: TwilioService,
            useValue: {
              replyToUser: jest.fn(),
            },
          }
        ],
      }).compile();

      service = module.get<HookService>(HookService);
      mockTwilioService = module.get<TwilioService>(TwilioService);
  })

  it('should return success response when send message with valid content', async() => {
    jest.spyOn(mockTwilioService, 'replyToUser').mockImplementation(() => Promise.resolve({
      body: 'Sample message',
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb'
    }));

    const response = await service.sendMessage(mockReceivedMessage({
      body: '1',
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

  it('should return failed response when send message with invalid content', async() => {
    jest.spyOn(mockTwilioService, 'replyToUser').mockImplementation(() => Promise.resolve({
      body: 'Por favor responda apenas com o número de uma das alternativas',
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb'
    }));

    const response = await service.sendMessage(mockReceivedMessage({
      body: 'Invalid',
      profileName: 'Ada Lovelace',
      to: 'whatsapp:+12345678900',
      waId: '5511988885555',
      smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
      accountSid: '50M34c01quertacggd9876'
    }))

    expect(response).toMatchObject({
      body: 'Por favor responda apenas com o número de uma das alternativas',
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb'
    })
  })
});
