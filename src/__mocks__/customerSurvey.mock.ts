import { randomUUID } from 'crypto';
import {
  CustomerSurveyModel,
  QuestionModel,
} from '../customer/model/customerSurvey.model';

interface MockQuestionData {
  id: string;
  question: string;
  order: number;
}

export const mockQuestion = (body: {
  customerId: string;
  surveyId: string;
  questionId: string;
  question: string;
  order: number;
}): QuestionModel => ({
  id: body.questionId,
  surveyId: body.surveyId,
  question: body.question,
  order: body.order,
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
});

export const mockCustomerSurvey = (body: {
  customerId: string;
  surveyId: string;
  questions: MockQuestionData[];
}): CustomerSurveyModel => ({
  id: randomUUID(),
  active: true,
  customerId: body.customerId,
  surveyId: body.surveyId,
  survey: {
    id: body.surveyId,
    name: 'Survey',
    title: 'Main survey',
    questions: body.questions.map((question) =>
      mockQuestion({
        ...body,
        questionId: question.id,
        question: question.question,
        order: question.order,
      }),
    ),
  },
});
