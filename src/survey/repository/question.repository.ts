import { QuestionDetailModel } from '../model/questionDetail.model';

export abstract class QuestionRepository {
  abstract getFirstQuestionBySurveyId(
    surveyId: string,
  ): Promise<QuestionDetailModel>;
}
