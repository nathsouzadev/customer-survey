import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { CustomerAnswerService } from '../../customerAnswer/customerAnswer.service';
import { randomUUID } from 'crypto';

describe('SurveyService', () => {
  let service: SurveyService;
  let mockCustomerAnswerService: CustomerAnswerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: CustomerAnswerService,
          useValue: {
            saveCustomerAnswer: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    mockCustomerAnswerService = module.get<CustomerAnswerService>(CustomerAnswerService)
  });

  it('should be return survey', () => {
    const survey = service.getSurvey();
    expect(survey).toMatchObject({
      id: 'survey',
      name: 'Exampled Survey',
      title: 'Customer Experience',
      questions: [
        {
          id: 'question',
          surveyId: 'survey',
          question: 'Como você avalia o nosso atendimento?',
          answers: [
            { label: 'bom', quantity: 3 },
            { label: 'regular', quantity: 2 },
            { label: 'ruim', quantity: 1 },
          ],
        },
        {
          id: 'question-b',
          surveyId: 'survey',
          question: 'Você agendou um novo atendimento?',
          answers: [
            { label: 'bom', quantity: 3 },
            { label: 'regular', quantity: 2 },
            { label: 'ruim', quantity: 1 },
          ],
        },
      ],
    });
  });

  it('should be add a new answer to survey and return nextQuestion with question', async() => {
    const mockCustomerId = randomUUID()
    const mockSaveCustomerAnswer = jest.spyOn(mockCustomerAnswerService, 'saveCustomerAnswer').mockImplementation(() => Promise.resolve({
      answer: {
        id: randomUUID(),
        customerId: mockCustomerId,
        answer: 'bom',
      },
      totalAnswers: 1,
    }))
    
    const response = await service.addAnswerToSurvey({
      answer: '1',
      customer: '5511999991111',
    })
    expect(mockSaveCustomerAnswer).toHaveBeenCalledWith({
      answer: 'bom',
      customer: '5511999991111',
    })
    expect(response).toMatchObject({
      answerReceived: {
        id: expect.any(String),
        questionId: 'question',
        answer: '1',
        label: 'bom',
      },
      nextQuestion: 'Você agendou um novo atendimento?',
    });
  });

  it('should be add a new answer to survey and return nextQuestion with null', async() => {
    const mockCustomerId = randomUUID()
    const mockSaveCustomerAnswer = jest.spyOn(mockCustomerAnswerService, 'saveCustomerAnswer').mockImplementation(() => Promise.resolve({
      answer: {
        id: randomUUID(),
        customerId: mockCustomerId,
        answer: 'bom',
      },
      totalAnswers: 2,
    }))
    
    const response = await service.addAnswerToSurvey({
      answer: '1',
      customer: '5511999992222',
    })
    expect(mockSaveCustomerAnswer).toHaveBeenCalledWith({
      answer: 'bom',
      customer: '5511999992222',
    })
    expect(response).toMatchObject({
      answerReceived: {
        id: expect.any(String),
        questionId: 'question',
        answer: '1',
        label: 'bom',
      },
      nextQuestion: null,
    });
  });
});
