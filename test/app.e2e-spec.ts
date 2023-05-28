import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { mockReceivedMessage } from '../src/__mocks__/receivedMessage.mock';
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient({ log: ['query'] });

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('receive next question when user do not finish survey', async () => {
    return request(app.getHttpServer())
      .post('/')
      .send(
        mockReceivedMessage({
          body: '1',
          profileName: 'Ada Lovelace',
          to: 'whatsapp:+12345678900',
          waId: '5511999991111',
          smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
          accountSid: '50M34c01quertacggd9876',
        }),
      )
      .expect(201)
      .then(async response => {
        expect(response.body).toMatchObject({
          status: 'ok',
          response: {
            body: 'Você agendou um novo atendimento?',
            direction: 'outbound-api',
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+5511999991111',
            dateUpdated: expect.any(String),
            status: 'queued',
            sid: expect.any(String),
          },
        });

        const answer = await prismaClient.customerAnswer.findFirst({
          where: {
            customerId: 'eb05a7a9-3c5b-460f-866b-1dbd321f38b6'
          }
        })

        expect(answer).toMatchObject({
          id: expect.any(String),
          customerId: 'eb05a7a9-3c5b-460f-866b-1dbd321f38b6',
          answer: 'bom'
        })

        await prismaClient.customerAnswer.delete({
          where: {
            id: answer.id
          }
        })
      });
  });

  it('receive thank message when user do not finish survey', async () => {
    return request(app.getHttpServer())
      .post('/')
      .send(
        mockReceivedMessage({
          body: '2',
          profileName: 'Ada Lovelace',
          to: 'whatsapp:+12345678900',
          waId: '5511999992222',
          smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
          accountSid: '50M34c01quertacggd9876',
        }),
      )
      .expect(201)
      .then(async response => {
        expect(response.body).toMatchObject({
          status: 'ok',
          response: {
            body: 'Obrigada pela sua resposta!',
            direction: 'outbound-api',
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+5511999992222',
            dateUpdated: expect.any(String),
            status: 'queued',
            sid: expect.any(String),
          },
        });

        const answer = await prismaClient.customerAnswer.findMany({
          where: {
            customerId: '492f8f28-75f0-4bdf-ac75-f4487d2d0d39'
          }
        })

        expect(answer[1]).toMatchObject({
          id: expect.any(String),
          customerId: '492f8f28-75f0-4bdf-ac75-f4487d2d0d39',
          answer: 'regular'
        })

        await prismaClient.customerAnswer.delete({
          where: {
            id: answer[1].id
          }
        })
      });
  });

  it('receive message with invalid body', async () => {
    return request(app.getHttpServer())
      .post('/')
      .send(
        mockReceivedMessage({
          body: 'Invalid body',
          profileName: 'Ada Lovelace',
          to: 'whatsapp:+12345678900',
          waId: '5511988885555',
          smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
          accountSid: '50M34c01quertacggd9876',
        }),
      )
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject({
          status: 'ok',
          response: {
            body: 'Por favor responda apenas com o número de uma das alternativas',
            direction: 'outbound-api',
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+5511988885555',
            dateUpdated: expect.any(String),
            status: 'queued',
            sid: expect.any(String),
          },
        });
      });
  });
});
