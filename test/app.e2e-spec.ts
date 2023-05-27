import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { mockReceivedMessage } from '../src/__mocks__/receivedMessage.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('receive message with valid body', async () => {
    return request(app.getHttpServer())
      .post('/')
      .send(
        mockReceivedMessage({
          body: '1',
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
            body: 'Obrigada pela sua resposta!',
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
