import { SurveyResults } from '../model/surveyResult';

export abstract class SurveyRepository {
  abstract getSurveyResultById(surveyId: string): Promise<SurveyResults>;
}
