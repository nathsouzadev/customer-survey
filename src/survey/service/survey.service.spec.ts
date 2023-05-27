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
    expect(service.getSurvey()).toMatchObject({
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
      ],
    });
  });

  it('should be convert surveyDto to surveyModel', () => {
    const mockOrderedAnswer = [
      { label: 'bom', quantity: 3 },
      { label: 'regular', quantity: 2 },
      { label: 'ruim', quantity: 1 },
    ];
    const mockSurveyDto = {
      id: 'survey',
      name: 'Exampled Survey',
      title: 'Customer Experience',
      questions: [
        {
          id: 'question',
          surveyId: 'survey',
          question: 'Como você avalia o nosso atendimento?',
          answers: [
            { id: 'a', questionId: 'question', answer: '1', label: 'bom' },
            { id: 'b', questionId: 'question', answer: '1', label: 'bom' },
            { id: 'c', questionId: 'question', answer: '1', label: 'bom' },
            { id: 'd', questionId: 'question', answer: '2', label: 'regular' },
            { id: 'e', questionId: 'question', answer: '2', label: 'regular' },
            { id: 'f', questionId: 'question', answer: '3', label: 'ruim' },
          ],
        },
      ],
    };

    expect(
      service.converSurveyToModel(mockSurveyDto, mockOrderedAnswer),
    ).toMatchObject({
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
      ],
    });
  });

  it('should be add a new answer to survey', () => {
    expect(service.addAnswerToSurvey('1')).toMatchObject({
      id: expect.any(String),
      questionId: 'question',
      answer: '1',
      label: 'bom',
    });
  });
});
