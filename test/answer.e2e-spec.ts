import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { mockReceivedMessage } from '../src/__mocks__/receivedMessage.mock';

describe('AnswerController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/answer (GET)', async() => {
    return request(app.getHttpServer())
      .get('/answer')
      .expect(200)
      .then(response => {
        expect(response.body).toMatchObject({
          data: [
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
        })
      })
  });
});
