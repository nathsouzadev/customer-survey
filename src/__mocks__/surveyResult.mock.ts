import { randomUUID } from 'crypto';
import { SurveyResultDetails } from '../survey/model/surveyResultDetails';

interface DataMockSurveyResult {
  companyId: string;
  surveyId: string;
  questionId: string;
}

export const getMockSurveyResult = (
  data: DataMockSurveyResult,
): SurveyResultDetails => ({
  id: data.surveyId,
  companyId: data.companyId,
  name: 'Survey',
  title: 'Customer Survey',
  questions: [
    {
      id: data.questionId,
      surveyId: data.surveyId,
      question: 'Question',
      order: 1,
      customerAnswers: [
        {
          id: randomUUID(),
          customerId: randomUUID(),
          answer: 'Yes',
          questionId: data.questionId,
        },
        {
          id: randomUUID(),
          customerId: randomUUID(),
          answer: 'Yes',
          questionId: data.questionId,
        },
        {
          id: randomUUID(),
          customerId: randomUUID(),
          answer: 'Yes',
          questionId: data.questionId,
        },
      ],
    },
  ],
});
