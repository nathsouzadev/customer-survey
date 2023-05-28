import { Test, TestingModule } from '@nestjs/testing';
import { HookService } from './hook.service';
import { TwilioService } from '../../client/twilio/twilio.service';
import { mockReceivedMessage } from '../../__mocks__/receivedMessage.mock';
import { SurveyService } from '../../survey/service/survey.service';

describe('HookService', () => {
  let service: HookService;
  let mockTwilioService: TwilioService;
  let mockSurveyService: SurveyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HookService,
        {
          provide: TwilioService,
          useValue: {
            replyToUser: jest.fn(),
          },
        },
        {
          provide: SurveyService,
          useValue: {
            addAnswerToSurvey: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HookService>(HookService);
    mockTwilioService = module.get<TwilioService>(TwilioService);
    mockSurveyService = module.get<SurveyService>(SurveyService);
  });

  it('should send message replyMessage with next question when customerAnswers is less than surveyLength', async () => {
    const mockReplyToUser = jest
      .spyOn(mockTwilioService, 'replyToUser')
      .mockImplementation(() =>
        Promise.resolve({
          body: 'Next question',
          direction: 'outbound-api',
          from: 'whatsapp:+12345678900',
          to: 'whatsapp:+5511988885555',
          dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
          status: 'queued',
          sid: 'FMsGH890912dasb',
        }),
      );
    const mockUpdate = jest
      .spyOn(mockSurveyService, 'addAnswerToSurvey')
      .mockImplementation(() => ({
        answerReceived: {
          id: 'a',
          questionId: 'question',
          answer: '1',
          label: 'bom',
        },
        surveyLength: 2,
        customerAnswers: 1,
        nextQuestion: 'Next question'
      }));

    const mockMessage = mockReceivedMessage({
      body: '1',
      profileName: 'Ada Lovelace',
      to: 'whatsapp:+12345678900',
      waId: '5511988885555',
      smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
      accountSid: '50M34c01quertacggd9876',
    });

    const response = await service.sendMessage(mockMessage);
    expect(mockReplyToUser).toHaveBeenCalledWith({
      message: mockMessage,
      isValid: true,
      replyMessage: 'Next question'
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      answer: '1',
      customer: '5511988885555'
    });
    expect(response).toMatchObject({
      body: 'Next question',
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb',
    });
  });

  it('should send message replyMessage null when customerAnswers is equal than surveyLength', async () => {
    const mockReplyToUser = jest
      .spyOn(mockTwilioService, 'replyToUser')
      .mockImplementation(() =>
        Promise.resolve({
          body: 'Obrigada pela sua resposta',
          direction: 'outbound-api',
          from: 'whatsapp:+12345678900',
          to: 'whatsapp:+5511988885555',
          dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
          status: 'queued',
          sid: 'FMsGH890912dasb',
        }),
      );
    const mockUpdate = jest
      .spyOn(mockSurveyService, 'addAnswerToSurvey')
      .mockImplementation(() => ({
        answerReceived: {
          id: 'a',
          questionId: 'question',
          answer: '1',
          label: 'bom',
        },
        surveyLength: 2,
        customerAnswers: 2,
        nextQuestion: null
      }));

    const mockMessage = mockReceivedMessage({
      body: '1',
      profileName: 'Ada Lovelace',
      to: 'whatsapp:+12345678900',
      waId: '5511988885555',
      smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
      accountSid: '50M34c01quertacggd9876',
    });

    const response = await service.sendMessage(mockMessage);
    expect(mockReplyToUser).toHaveBeenCalledWith({
      message: mockMessage,
      isValid: true,
      replyMessage: null
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      answer: '1',
      customer: '5511988885555'
    });
    expect(response).toMatchObject({
      body: 'Obrigada pela sua resposta',
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb',
    });
  });

  it('should return failed response when send message with invalid content', async () => {
    const mockReplyToUser = jest
      .spyOn(mockTwilioService, 'replyToUser')
      .mockImplementation(() =>
        Promise.resolve({
          body: 'Por favor responda apenas com o número de uma das alternativas',
          direction: 'outbound-api',
          from: 'whatsapp:+12345678900',
          to: 'whatsapp:+5511988885555',
          dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
          status: 'queued',
          sid: 'FMsGH890912dasb',
        }),
      );
    const mockMessage = mockReceivedMessage({
      body: 'Invalid',
      profileName: 'Ada Lovelace',
      to: 'whatsapp:+12345678900',
      waId: '5511988885555',
      smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
      accountSid: '50M34c01quertacggd9876',
    });

    const response = await service.sendMessage(mockMessage);
    expect(mockReplyToUser).toHaveBeenCalledWith({
      message: mockMessage,
      isValid: false,
      replyMessage: null
    });
    expect(response).toMatchObject({
      body: 'Por favor responda apenas com o número de uma das alternativas',
      direction: 'outbound-api',
      from: 'whatsapp:+12345678900',
      to: 'whatsapp:+5511988885555',
      dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
      status: 'queued',
      sid: 'FMsGH890912dasb',
    });
  });
});
