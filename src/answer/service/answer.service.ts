import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from '../dto/create-answer.dto';
import { UpdateAnswerDto } from '../dto/update-answer.dto';

let data = [
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

@Injectable()
export class AnswerService {
  getData = () => {
    return data
  }

  updateResults = (value: string) => {
    let newData = data
    newData[0].results[0][Object.keys(newData[0].results[0])[Number(value) - 1]] += 1

    data = newData

    console.log(data[0])

    return data
  }
}
