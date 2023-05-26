import { Test, TestingModule } from '@nestjs/testing';
import { AnswerService } from './answer.service';

describe('AnswerService', () => {
  let service: AnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnswerService],
    }).compile();

    service = module.get<AnswerService>(AnswerService);
  });

  it('should be return data', () => {
    expect(service.getData()).toMatchObject([
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
    ]);
  })

  it('should update data', () => {
    const response = service.updateResults('2')
    expect(response).toMatchObject([
      { 
        answer: 'Como você avalia o nosso atendimento?',
        results: [{
          bom: 20,
          regular: 11,
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
    ])
  })
});
