import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getToken } from './aux/token';
import nock from 'nock';
import { prismaClient } from './aux/prisma';

describe('SurveyController', () => {
  let app: INestApplication;
  const mockUrl = 'https://graph.facebook.com/v17.0';
  process.env.WB_URL = mockUrl;
  const mockPhoneNumberId = '1234567890';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
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
    it('should send survey to customers registered', async () => {
      nock(`${mockUrl}/${mockPhoneNumberId}/messages`)
        .post('')
        .times(6)
        .reply(200, {
          messaging_product: 'whatsapp',
          contacts: [
            {
              input: '5511999991111',
              wa_id: '5511999991111',
            },
          ],
          messages: [
            {
              id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          ],
        });
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/meta/company/survey/29551fe2-3059-44d9-ab1a-f5318368b88f')
        .auth(token, { type: 'bearer' })
        .send({
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
          name: 'Company',
        })
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({
            surveySent: {
              surveyId: '29551fe2-3059-44d9-ab1a-f5318368b88f',
              status: 'sent',
              totalCustomers: 3,
            },
          });
        });
    });

    it('should not send survey when not have customers registered', async () => {
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/meta/company/survey/e5c02305-defc-444e-9ca9-7bbcb714063b')
        .auth(token, { type: 'bearer' })
        .send({
          companyId: '2b6cdc39-0dcf-4a27-b508-13dc97453aa7',
          name: 'Company',
        })
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({
            surveySent: {
              surveyId: 'e5c02305-defc-444e-9ca9-7bbcb714063b',
              status: 'no-customers',
              totalCustomers: 0,
            },
          });
        });
    });

    it('should return 401 when does not have token', async () => {
      jest.clearAllMocks();
      return request(app.getHttpServer())
        .post('/meta/company/survey/29551fe2-3059-44d9-ab1a-f5318368b88f')
        .expect(401);
    });
  });

  describe('create survey', () => {
    it('should create survey and return surveyId', async () => {
      const token = await getToken(app, request);
      return request(app.getHttpServer())
        .post('/company/survey')
        .send({
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
          name: 'Survey',
          title: 'Title',
          questions: [
            {
              question: 'Question',
              order: 1,
              answers: [
                {
                  label: '1',
                  answer: 'Answer',
                },
              ],
            },
          ],
        })
        .auth(token, { type: 'bearer' })
        .expect(201)
        .then(async (response) => {
          const surveyId = response.body.surveyId;
          expect(response.body).toMatchObject({
            surveyId: expect.any(String),
          });

          const survey = await prismaClient.survey.findFirst({
            where: {
              id: surveyId,
            },
            include: {
              questions: {
                include: {
                  answers: true,
                },
              },
            },
          });

          expect(survey).toMatchObject({
            id: expect.any(String),
            companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
            name: 'Survey',
            title: 'Title',
            questions: [
              {
                id: expect.any(String),
                surveyId: expect.any(String),
                question: 'Question',
                order: 1,
                answers: [
                  {
                    id: expect.any(String),
                    questionId: expect.any(String),
                    label: '1',
                    answer: 'Answer',
                  },
                ],
              },
            ],
          });

          await prismaClient.questionAnswer.delete({
            where: {
              id: survey.questions[0].answers[0].id,
            },
          });
          await prismaClient.question.delete({
            where: {
              id: survey.questions[0].id,
            },
          });
          await prismaClient.survey.delete({
            where: {
              id: survey.id,
            },
          });
        });
    });

    it('should return 401 when does not have token', async () => {
      jest.clearAllMocks();
      return request(app.getHttpServer())
        .post('/company/survey')
        .send({
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
          name: 'Survey',
          title: 'Title',
          questions: [
            {
              question: 'Question',
              order: 1,
              answers: [
                {
                  label: '1',
                  answer: 'Answer',
                },
              ],
            },
          ],
        })
        .expect(401);
    });

    it('should return 400 when does not have companyId', async () => {
      jest.clearAllMocks();
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/company/survey')
        .send({
          companyId: '',
          name: 'Survey',
          title: 'Title',
          questions: [
            {
              question: 'Question',
              order: 1,
              answers: [
                {
                  label: '1',
                  answer: 'Answer',
                },
              ],
            },
          ],
        })
        .auth(token, { type: 'bearer' })
        .expect(400)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            error: 'Bad Request',
            message: ['Required field'],
          });
        });
    });

    it('should return 400 when does not have name', async () => {
      jest.clearAllMocks();
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/company/survey')
        .send({
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
          name: '',
          title: 'Title',
          questions: [
            {
              question: 'Question',
              order: 1,
              answers: [
                {
                  label: '1',
                  answer: 'Answer',
                },
              ],
            },
          ],
        })
        .auth(token, { type: 'bearer' })
        .expect(400)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            error: 'Bad Request',
            message: ['Required field'],
          });
        });
    });

    it('should return 400 when does not have title', async () => {
      jest.clearAllMocks();
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/company/survey')
        .send({
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
          name: 'Survey',
          title: '',
          questions: [
            {
              question: 'Question',
              order: 1,
              answers: [
                {
                  label: '1',
                  answer: 'Answer',
                },
              ],
            },
          ],
        })
        .auth(token, { type: 'bearer' })
        .expect(400)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            error: 'Bad Request',
            message: ['Required field'],
          });
        });
    });

    it('should return 400 when does not have questions', async () => {
      jest.clearAllMocks();
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/company/survey')
        .send({
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
          name: 'Survey',
          title: 'Title',
          questions: '',
        })
        .auth(token, { type: 'bearer' })
        .expect(400)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            error: 'Bad Request',
            message: ['Required field'],
          });
        });
    });
  });

  describe('sender send survey', () => {
    it.only('should sender can ser survey to customer', async () => {
      nock(`${mockUrl}/${mockPhoneNumberId}/messages`)
        .post('')
        .reply(200, {
          messaging_product: 'whatsapp',
          contacts: [
            {
              input: '5511999991111',
              wa_id: '5511999991111',
            },
          ],
          messages: [
            {
              id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          ],
        });

      return request(app.getHttpServer())
        .post('/meta/company/sender/survey')
        .send({
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
          senderEmail: 'sender@company.com',
          phoneNumber: '11999991111',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toMatchObject({
            messageId:
              'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
          });
        });
    });
  });
});
