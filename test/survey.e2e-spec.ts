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
      .get('/company/survey')
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body).toMatchObject({
          id: '29551fe2-3059-44d9-ab1a-f5318368b88f',
          name: 'Survey',
          title: 'Customer Survey',
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
          questions: [
            {
              id: '35958c5c-bcaf-4851-803b-27c3f837624f',
              surveyId: '29551fe2-3059-44d9-ab1a-f5318368b88f',
              question: 'Question 1',
              answers: [
                { label: 'bom', quantity: 3 },
                { label: 'regular', quantity: 2 },
                { label: 'ruim', quantity: 1 },
              ],
            },
            {
              id: '310db204-c0bb-4454-8424-d8783f99afb1',
              surveyId: '29551fe2-3059-44d9-ab1a-f5318368b88f',
              question: 'Question 2',
              answers: [],
            },
          ],
        });
      });
  });
});
