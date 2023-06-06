import { AppLogger } from './appLogger';
import { mockReceivedMessage } from '../__mocks__/receivedMessage.mock';
import * as crypto from 'crypto';

const mockCorrelationId = '33999170-7f14-4f19-ac5b-437165a77958';
jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockImplementation(() => mockCorrelationId),
}));

describe('AppLogger', () => {
  let appLogger: AppLogger;

  beforeEach(() => {
    global.correlationId = '';
    appLogger = new AppLogger();
  });

  it('should log a message with correlationId saved on global object', () => {
    global.correlationId = mockCorrelationId;
    jest.spyOn(appLogger, 'log');

    const message = JSON.stringify({
      correlationId: mockCorrelationId,
      message: 'Some message to log',
    });
    const context = 'Some context';
    appLogger.logger({ message: 'Some message to log' }, context);

    expect(appLogger.log).toHaveBeenCalledWith(message, context);
  });

  it('should log a message with correlationId received on request', () => {
    jest.spyOn(appLogger, 'log');

    const message = JSON.stringify({
      correlationId: mockCorrelationId,
      message: 'Some message to log',
    });
    const context = 'Some context';
    appLogger.logger(
      {
        headers: {
          'x-correlation-id': mockCorrelationId,
        },
        message: 'Some message to log',
      },
      context,
    );
    expect(global.correlationId).toBe(mockCorrelationId);
    expect(appLogger.log).toHaveBeenCalledWith(message, context);
  });

  it('should generate correlationId when receive header without value', () => {
    jest.spyOn(appLogger, 'log');

    const message = JSON.stringify({
      correlationId: mockCorrelationId,
      message: 'Some message to log',
    });
    const context = 'Some context';
    appLogger.logger(
      {
        headers: {},
        message: 'Some message to log',
      },
      context,
    );
    expect(global.correlationId).toBe(mockCorrelationId);
    expect(appLogger.log).toHaveBeenCalledWith(message, context);
  });

  it('should masked all personal data on request', () => {
    const mockMessage = mockReceivedMessage({
      body: '1',
      profileName: 'Ada Lovelace',
      to: 'whatsapp:+12345678900',
      waId: '5511988885555',
      smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
      accountSid: '50M34c01quertacggd9876',
    });
    jest
      .spyOn(crypto, 'randomUUID')
      .mockImplementation(() => mockCorrelationId),
      jest.spyOn(appLogger, 'log');

    const message = JSON.stringify({
      correlationId: mockCorrelationId,
      requestData: {
        SmsMessageSid: 'SMba82e029e2ba3f080b2d49c0c0328eff',
        NumMedia: '0',
        ProfileName: '********lace',
        SmsSid: 'SMba83e029e2ba3f080b2d49c0c03',
        WaId: '*********5555',
        SmsStatus: 'received',
        Body: '1',
        To: 'whatsapp:+*******8900',
        NumSegments: '1',
        ReferralNumMedia: '0',
        MessageSid: 'SMba83e029e2ba3f080b2d49c0c03',
        AccountSid: '50M34c01quertacggd9876',
        From: `whatsapp:+*********5555`,
        ApiVersion: '2010-04-01',
      },
      message: 'Some message to log',
    });

    const context = 'Some context';
    appLogger.logger(
      {
        headers: {},
        requestData: mockMessage,
        message: 'Some message to log',
      },
      context,
    );
    expect(global.correlationId).toBe(mockCorrelationId);
    expect(appLogger.log).toHaveBeenCalledWith(message, context);
  });
});
