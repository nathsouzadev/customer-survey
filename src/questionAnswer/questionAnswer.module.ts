import { Module } from '@nestjs/common';
import { QuestionAnswerService } from './questionAnswer.service';
import { PrismaService } from '../client/prisma/prisma.service';
import { QuestionAnswerRepository } from './repository/questionAnswer.repository';
import { PrismaQuestionAnswerRepository } from './repository/prisma/prismaQuestionAnswer.repository';

@Module({
  providers: [
    QuestionAnswerService,
    {
      provide: QuestionAnswerRepository,
      useClass: PrismaQuestionAnswerRepository
    },
    PrismaService
  ],
})
export class QuestionAnswerModule {}
