import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getToken } from './aux/token';
import { timeOut } from './aux/timeout';
import nock from 'nock';
import { PrismaService } from '../../src/client/prisma/prisma.service';

describe('SurveyController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  const mockUrl = 'https://graph.facebook.com/v17.0';
  process.env.WB_URL = mockUrl;
  process.env.ADMIN_PHONE = '1234567890';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get(PrismaService);
    await app.init();
    await timeOut();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
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
      for (let i = 0; i < 6; i++) {
        nock(`${mockUrl}/${process.env.ADMIN_PHONE}/messages`)
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
      }
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
  });

  it('should not send survey twhe not have customers registered', async () => {
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
