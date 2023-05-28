import { Module } from '@nestjs/common';
import { QuestionAnswerService } from './questionAnswer.service';

@Module({
  providers: [QuestionAnswerService]
})
export class QuestionAnswerModule {}
