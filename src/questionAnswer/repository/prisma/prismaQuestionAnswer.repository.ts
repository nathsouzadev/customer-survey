import { Injectable } from '@nestjs/common';
import { QuestionAnswer } from '@prisma/client';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { QuestionAnswerRepository } from '../questionAnswer.repository';

@Injectable()
export class PrismaQuestionAnswerRepository
  implements QuestionAnswerRepository
{
  constructor(private readonly prisma: PrismaService) {}

  getAnswersByQuestionId = async (
    questionId: string,
  ): Promise<QuestionAnswer[]> =>
    this.prisma.questionAnswer.findMany({
      where: {
        questionId,
      },
    });
}
