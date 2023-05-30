import { SurveyResults } from '../model/surveyResult';

export abstract class SurveyRepository {
  abstract getSurveyById(surveyId: string): Promise<SurveyResults>;
}
