import { AppLogger } from './appLogger';
import * as crypto from 'crypto';
import { mockReceivedMessageFromMeta } from '../__mocks__/metaReceivedMessage.mock';

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
    const mockMessage = mockReceivedMessageFromMeta({
      message: '1',
      receiver: '12345678900',
      sender: '5511988885555',
      type: 'message'
    });
    jest
      .spyOn(crypto, 'randomUUID')
      .mockImplementation(() => mockCorrelationId),
      jest.spyOn(appLogger, 'log');

    const message = JSON.stringify({
      correlationId: mockCorrelationId,
      requestData: {
        ...mockMessage,
        entry: [
          {
            ...mockMessage.entry[0],
            changes: [
              {
                ...mockMessage.entry[0].changes[0],
                value: {
                  ...mockMessage.entry[0].changes[0].value,
                  metadata: {
                    ...mockMessage.entry[0].changes[0].value.metadata,
                    display_phone_number: '*******8900',
                  },
                  contacts: [
                    {
                      ...mockMessage.entry[0].changes[0].value['contacts'][0],
                      wa_id: '*******8900',
                    },
                  ],
                  messages: [
                    {
                      ...mockMessage.entry[0].changes[0].value['messages'][0],
                      from: '*********5555',
                    },
                  ],
                },
              },
            ],
          },
        ],
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

  it('should masked all personal data on request with updateRequest', () => {
    const mockMessage = mockReceivedMessageFromMeta({
      message: '1',
      receiver: '12345678900',
      sender: '5511988885555',
      type: 'update'
    });
    jest
      .spyOn(crypto, 'randomUUID')
      .mockImplementation(() => mockCorrelationId),
      jest.spyOn(appLogger, 'log');

    const message = JSON.stringify({
      correlationId: mockCorrelationId,
      requestData: mockMessage,
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
