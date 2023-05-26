import { Controller, Get } from '@nestjs/common';
import { AnswerService } from './service/answer.service';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Get()
  findAll() {
    return { data: [
      { 
        answer: 'Como você avalia o nosso atendimento?',
        results: [{
          bom: 20,
          regular: 10,
          ruim: 5
        }]
      },
      {
        answer: 'Você maracará o seu retorno?',
        results: [{
          sim: 25,
          talvez: 7,
          nao: 3
        }]
      }
    ]}
  }
}
