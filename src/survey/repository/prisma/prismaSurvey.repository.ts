import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { SurveyRepository } from '../survey.repository';
import { SurveyResults } from '../../../survey/model/surveyResult';

@Injectable()
export class PrismaSurveyRepository implements SurveyRepository {
  constructor(private readonly prisma: PrismaService) {}

  getSurveyResultById = async (surveyId: string): Promise<SurveyResults> =>
    this.prisma.survey.findFirst({
      where: {
        id: surveyId,
      },
      include: {
        questions: {
          include: {
            customerAnswers: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
}
