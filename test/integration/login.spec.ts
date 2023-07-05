import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { timeOut } from './aux/timeout';

describe('CompanyController', () => {
  let app: INestApplication;
  process.env.TOKEN = 'dev-secret';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await timeOut();
  });

  describe('Login', () => {
    it('should return token with correct credentials', async () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({
          email: 'company@email.com',
          password: 'password',
        })
        .expect(201)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            token: expect.any(String),
          });
        });
    });

    it('should return token with correct credentials', async () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({
          email: 'company@email.com',
          password: 'wrong-password',
        })
        .expect(401)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            message: 'Unauthorized',
          });
        });
    });
  });
});
