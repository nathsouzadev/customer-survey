import { Survey } from '@prisma/client';
import { SurveyResultDetails } from '../model/surveyResultDetails';
import { CreateSurveyRequestDTO } from '../dto/createSurveyRequest.dto';

export abstract class SurveyRepository {
  abstract getSurveyResultById(surveyId: string): Promise<SurveyResultDetails>;

  abstract createSurvey(
    createSurveyRequest: CreateSurveyRequestDTO,
  ): Promise<Survey>;
}
