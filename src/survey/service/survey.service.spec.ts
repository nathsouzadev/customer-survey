import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';

describe('SurveyService', () => {
  let service: SurveyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyService],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
  });

  it('should be return survey', () => {
    const survey = service.getSurvey();
    console.log(survey.questions[1]);
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

  it('should be add a new answer to survey and return nextQuestion with question', () => {
    expect(
      service.addAnswerToSurvey({
        answer: '1',
        customer: '5511999991111',
      }),
    ).toMatchObject({
      answerReceived: {
        id: expect.any(String),
        questionId: 'question',
        answer: '1',
        label: 'bom',
      },
      surveyLength: 2,
      customerAnswers: 1,
      nextQuestion: 'Você agendou um novo atendimento?',
    });
  });

  it('should be add a new answer to survey and return nextQuestion with null', () => {
    expect(
      service.addAnswerToSurvey({
        answer: '1',
        customer: '5511999992222',
      }),
    ).toMatchObject({
      answerReceived: {
        id: expect.any(String),
        questionId: 'question',
        answer: '1',
        label: 'bom',
      },
      surveyLength: 2,
      customerAnswers: 2,
      nextQuestion: null,
    });
  });
});
