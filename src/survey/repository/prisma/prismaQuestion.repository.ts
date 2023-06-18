import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { QuestionRepository } from '../question.repository';
import { QuestionDetailModel } from 'src/survey/model/questionDetail.model';

@Injectable()
export class PrismaQuestionRepository implements QuestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  getFirstQuestionBySurveyId = async (
    surveyId: string,
  ): Promise<QuestionDetailModel> =>
    this.prisma.question.findFirst({
      where: {
        surveyId,
        order: 1,
      },
      include: {
        answers: true,
      },
    });
}
