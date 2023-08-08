import { Question } from '@prisma/client';
import { QuestionDetailModel } from '../model/questionDetail.model';
import { CreateQuestionModel } from '../model/createQuestion.model';

export abstract class QuestionRepository {
  abstract getFirstQuestionBySurveyId(
    surveyId: string,
  ): Promise<QuestionDetailModel>;

  abstract creatQuestions(data: CreateQuestionModel): Promise<Question>;
}
