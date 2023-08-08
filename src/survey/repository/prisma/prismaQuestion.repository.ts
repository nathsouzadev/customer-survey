import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { QuestionRepository } from '../question.repository';
import { QuestionDetailModel } from '../../../survey/model/questionDetail.model';
import { Question } from '@prisma/client';
import { CreateQuestionModel } from '../../../survey/model/createQuestion.model';

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

  creatQuestions = (createQuestion: CreateQuestionModel): Promise<Question> =>
    this.prisma.question.create({
      data: {
        ...createQuestion,
        answers: {
          createMany: {
            data: createQuestion.answers,
          },
        },
      },
    });
}
