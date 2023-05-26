import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from '../dto/create-answer.dto';
import { UpdateAnswerDto } from '../dto/update-answer.dto';

@Injectable()
export class AnswerService {
  data = [
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
  ]

  getData = () => {
    return this.data
  }

  updateResults = (value: string) => {
    this.data[0].results[0][Object.keys(this.data[0].results[0])[Number(value) - 1]] += 1

    console.log(this.data[0])

    return this.data
  }
}
