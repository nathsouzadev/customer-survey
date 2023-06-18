import { QuestionRepository } from '../../survey/repository/question.repository';
import { PrismaSurveyRepository } from '../../survey/repository/prisma/prismaSurvey.repository';
import { SurveyRepository } from '../../survey/repository/survey.repository';
import { customerProviders } from './customerProviders';
import { PrismaQuestionRepository } from '../../survey/repository/prisma/prismaQuestion.repository';

export const surveyProviders = [
  {
    provide: SurveyRepository,
    useClass: PrismaSurveyRepository,
  },
  {
    provide: QuestionRepository,
    useClass: PrismaQuestionRepository,
  },
  ...customerProviders,
];
