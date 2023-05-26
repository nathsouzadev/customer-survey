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

  it('/ (POST)', async() => {
    return request(app.getHttpServer())
      .post('/')
      .send(mockReceivedMessage({
        profileName: 'Ada Lovelace',
        to: 'whatsapp:+12345678900',
        waId: '5511988885555',
        smsSid: 'SMba83e029e2ba3f080b2d49c0c03',
        accountSid: '50M34c01quertacggd9876'
      }))
      .expect(201)
      .then(response => {
        expect(response.body).toMatchObject(
          { status: 'ok' }
        )
      })
  });
});
