import { PrismaSurveyRepository } from '../../survey/repository/prisma/prismaSurvey.repository';
import { SurveyRepository } from '../../survey/repository/survey.repository';
import { customerProviders } from './customerProviders';

export const surveyProviders = [
  {
    provide: SurveyRepository,
    useClass: PrismaSurveyRepository,
  },
  ...customerProviders,
];
