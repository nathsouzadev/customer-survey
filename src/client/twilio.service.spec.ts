import { mockReceivedMessage } from '../__mocks__/receivedMessage.mock';
import { mockMessageSentRespose } from '../__mocks__/messageSentResponse.mock';
import { TwilioService } from './twilio.service';

const mockCreate = jest.fn().mockReturnValue(
  mockMessageSentRespose({
    body: 'Sample message',
    from: 'whatsapp:+12345678900',
    to: 'whatsapp:+5511988885555',
    accountSid: '50M34c01quertacggd9876',
    sid: 'FMsGH890912dasb',
  }),
);

const mockClient = {
  messages: {
    create: mockCreate,
  },
};

jest.mock('twilio', () => {
  return function () {
    return mockClient;
  };
});

describe('TwilioService', () => {
  const twilioService = new TwilioService();
  it('should return success message data when message have valid content and replyMessage', async () => {
    const mockMessage = mockReceivedMessage({
      body: '1',
      profileName: 'Ada Lovelace',
      to: 'whatsapp:+12345678900',
      waId: '5511988885555',
      smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
      accountSid: '50M34c01quertacggd9876',
    });

    const response = await twilioService.replyToUser({
      message: mockMessage,
      isValid: true,
      replyMessage: 'Other question'
    });
    expect(mockCreate).toHaveBeenCalledWith({
      from: process.env.ADMIN_PHONE,
      to: 'whatsapp:+5511988885555',
      body: 'Other question',
    });
    expect(response).toMatchObject({
      body: expect.any(String),
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb',
    });
  });

  it('should send finish message if have valid content and replyMessage is null', async () => {
    const mockMessage = mockReceivedMessage({
      body: '1',
      profileName: 'Ada Lovelace',
      to: 'whatsapp:+12345678900',
      waId: '5511988885555',
      smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
      accountSid: '50M34c01quertacggd9876',
    });

    const response = await twilioService.replyToUser({
      message: mockMessage,
      isValid: true,
      replyMessage: null
    });
    expect(mockCreate).toHaveBeenCalledWith({
      from: process.env.ADMIN_PHONE,
      to: 'whatsapp:+5511988885555',
      body: 'Obrigada pela sua resposta!',
    });
    expect(response).toMatchObject({
      body: expect.any(String),
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb',
    });
  });

  it('should return success message data when message have valid content and replyMessage is null', async () => {
    const mockMessage = mockReceivedMessage({
      body: 'Invalid content',
      profileName: 'Ada Lovelace',
      to: 'whatsapp:+12345678900',
      waId: '5511988885555',
      smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
      accountSid: '50M34c01quertacggd9876',
    });

    const response = await twilioService.replyToUser({
      message: mockMessage,
      isValid: false,
      replyMessage: null
    });
    expect(mockCreate).toHaveBeenCalledWith({
      from: process.env.ADMIN_PHONE,
      to: 'whatsapp:+5511988885555',
      body: 'Por favor responda apenas com o número de uma das alternativas',
    });
    expect(response).toMatchObject({
      body: expect.any(String),
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb',
    });
  });
});
