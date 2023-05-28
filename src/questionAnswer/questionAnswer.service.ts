import { Injectable } from '@nestjs/common';
import { QuestionAnswer } from '@prisma/client';
import { QuestionAnswerRepository } from './repository/questionAnswer.repository';

@Injectable()
export class QuestionAnswerService {
  constructor(
    private readonly questionAnswerRepository: QuestionAnswerRepository,
  ) {}
  getQuestionAnswers = async (questionId: string): Promise<QuestionAnswer[]> =>
    this.questionAnswerRepository.getAnswersByQuestionId(questionId);
}
