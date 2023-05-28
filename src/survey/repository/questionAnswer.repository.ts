import { QuestionAnswer } from '@prisma/client';

export abstract class QuestionAnswerRepository {
  abstract getAnswersByQuestionId(
    questionId: string,
  ): Promise<QuestionAnswer[]>;
}
