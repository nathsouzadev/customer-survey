import { Test, TestingModule } from '@nestjs/testing';
import { HookService } from './hook.service';
import { TwilioService } from '../../client/twilio.service';
import { mockReceivedMessage } from '../../__mocks__/receivedMessage.mock';
import { AnswerService } from '../../answer/service/answer.service';

describe('HookService', () => {
  let service: HookService;
  let mockTwilioService: TwilioService;
  let mockAnswerService: AnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
          HookService,
          {
            provide: TwilioService,
            useValue: {
              replyToUser: jest.fn()
            },
          },
          {
            provide: AnswerService,
            useValue: {
              updateResults: jest.fn()
            }
          }
        ],
      }).compile();

      service = module.get<HookService>(HookService);
      mockTwilioService = module.get<TwilioService>(TwilioService);
      mockAnswerService = module.get<AnswerService>(AnswerService);
  })

  it('should return success response when send message with valid content', async() => {
    const mockReplyToUser = jest.spyOn(mockTwilioService, 'replyToUser').mockImplementation(() => Promise.resolve({
      body: 'Obrigada pela sua resposta',
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb'
    }));
    const mockUpdate = jest.spyOn(mockAnswerService, 'updateResults').mockImplementation(() => [
      { 
        answer: 'Como você avalia o nosso atendimento?',
        results: [{
          bom: 20,
          regular: 11,
          ruim: 5
        }]
      }
    ])


    const mockMessage = mockReceivedMessage({
      body: '1',
      profileName: 'Ada Lovelace',
      to: 'whatsapp:+12345678900',
      waId: '5511988885555',
      smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
      accountSid: '50M34c01quertacggd9876'
    })

    const response = await service.sendMessage(mockMessage)
    expect(mockReplyToUser).toHaveBeenCalledWith({
      message: mockMessage,
      isValid: true
    })
    expect(mockUpdate).toHaveBeenCalledWith('1')
    expect(response).toMatchObject({
      body: 'Obrigada pela sua resposta',
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb'
    })
  })

  it('should return failed response when send message with invalid content', async() => {
    const mockReplyToUser = jest.spyOn(mockTwilioService, 'replyToUser').mockImplementation(() => Promise.resolve({
      body: 'Por favor responda apenas com o número de uma das alternativas',
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb'
    }));
    const mockMessage = mockReceivedMessage({
      body: 'Invalid',
      profileName: 'Ada Lovelace',
      to: 'whatsapp:+12345678900',
      waId: '5511988885555',
      smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
      accountSid: '50M34c01quertacggd9876'
    })

    const response = await service.sendMessage(mockMessage)
    expect(mockReplyToUser).toHaveBeenCalledWith({
      message: mockMessage,
      isValid: false
    })
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
