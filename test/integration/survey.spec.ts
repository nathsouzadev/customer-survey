import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getToken } from './aux/token';
import { timeOut } from './aux/timeout';

describe('SurveyController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await timeOut();
  });

  describe('Get survey by surveyId', () => {
    it('get survey', async () => {
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .get('/company/survey/29551fe2-3059-44d9-ab1a-f5318368b88f')
        .auth(token, { type: 'bearer' })
        .expect(200)
        .then((response) => {
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

    it('should return 401 when does not have token', async () => {
      jest.clearAllMocks();
      return request(app.getHttpServer())
        .get('/company/survey/29551fe2-3059-44d9-ab1a-f5318368b88f')
        .expect(401);
    });
  });

  describe('Send survey by surveId', () => {
    it('should send survey to customers registered', async() => {
      const token = await getToken(app, request);
    
      return request(app.getHttpServer())
        .post('/company/survey/29551fe2-3059-44d9-ab1a-f5318368b88f')
        .auth(token, { type: 'bearer' })
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject({
            surveySent: {
              surveyId: '29551fe2-3059-44d9-ab1a-f5318368b88f',
              status: 'sent',
              totalCustomers: 3
            }
          })
        })
    })
  })

  it('should return 401 when does not have token', async () => {
    jest.clearAllMocks();
    return request(app.getHttpServer())
      .post('/company/survey/29551fe2-3059-44d9-ab1a-f5318368b88f')
      .expect(401);
  });
});
