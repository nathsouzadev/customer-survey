import { randomUUID } from 'crypto';
import { CustomerSurveyModel } from '../customer/model/customerSurvey.model';

export const mockCustomerSurvey = (body: {
  customerId: string;
  surveyId: string;
  questionId: string;
  questionId2: string;
}): CustomerSurveyModel => ({
  id: randomUUID(),
  active: true,
  customerId: body.customerId,
  surveyId: body.surveyId,
  survey: {
    id: body.surveyId,
    name: 'Survey',
    title: 'Main survey',
    questions: [
      {
        id: body.questionId,
        surveyId: body.surveyId,
        question: 'Question 1',
        answers: [
          {
            id: randomUUID(),
            questionId: body.questionId,
            answer: '1',
            label: 'bom',
          },
          {
            id: randomUUID(),
            questionId: body.questionId,
            answer: '2',
            label: 'regular',
          },
          {
            id: randomUUID(),
            questionId: body.questionId,
            answer: '3',
            label: 'ruim',
          },
        ],
      },
      {
        id: body.questionId2,
        surveyId: body.surveyId,
        question: 'Question 2',
        answers: [
          {
            id: randomUUID(),
            questionId: body.questionId2,
            answer: '1',
            label: 'bom',
          },
          {
            id: randomUUID(),
            questionId: body.questionId2,
            answer: '2',
            label: 'regular',
          },
          {
            id: randomUUID(),
            questionId: body.questionId2,
            answer: '3',
            label: 'ruim',
          },
        ],
      },
    ],
  },
});
