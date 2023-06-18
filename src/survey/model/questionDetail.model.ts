import { QuestionAnswer } from '@prisma/client';

export class QuestionDetailModel {
  id: string;
  surveyId: string;
  question: string;
  answers: QuestionAnswer[];
}
