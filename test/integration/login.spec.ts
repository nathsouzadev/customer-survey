import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('CompanyController', () => {
  let app: INestApplication;
  process.env.TOKEN = 'dev-secret';

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
