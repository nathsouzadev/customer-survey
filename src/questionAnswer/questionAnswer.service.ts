import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionAnswerService {
  findAll() {
    return `This action returns all questionAnswer`;
  }
}
