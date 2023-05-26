import { mockReceivedMessage } from '../__mocks__/receivedMessage.mock';
import { mockMessageSentRespose } from '../__mocks__/messageSentResponse.mock';
import { TwilioService } from './twilio.service';

const mockClient = {
  messages: {
    create: jest.fn().mockReturnValue(mockMessageSentRespose({
      body: 'Sample message',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      accountSid: '50M34c01quertacggd9876',
      sid: 'FMsGH890912dasb'
    }))
  }
}

jest.mock('twilio', () => {
  return function(accountSid: string, authToken: string) {
    return mockClient
  }
})

describe('TwilioService', () => {
  const twilioService = new TwilioService();

  const mockMessage = mockReceivedMessage({
    profileName: 'Ada Lovelace',
    to: 'whatsapp:+12345678900',
    waId: '5511988885555',
    smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
    accountSid: '50M34c01quertacggd9876'
  })

  it('should return message data when message is sent', async() => {
    
    const response = await twilioService.sendToTwilio(mockMessage)
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
