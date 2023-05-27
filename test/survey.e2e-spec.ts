import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AnswerController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/survey (GET)', async () => {
    return request(app.getHttpServer())
      .get('/survey')
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          id: 'survey',
          name: 'Exampled Survey',
          title: 'Customer Experience',
          questions: [
            {
              id: 'question',
              surveyId: 'survey',
              question: 'Como você avalia o nosso atendimento?',
              answers: [
                { label: 'bom', quantity: 3 },
                { label: 'regular', quantity: 2 },
                { label: 'ruim', quantity: 1 },
              ],
            },
          ],
        });
      });
  });
});
