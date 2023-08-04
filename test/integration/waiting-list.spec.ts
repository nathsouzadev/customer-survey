import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { prismaClient } from './aux/prisma';

describe('WaitingListController', () => {
  let app: INestApplication;

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

  describe('Create waitingCompany', () => {
    it('should create waitingCompany', async () => {
      return request(app.getHttpServer())
        .post('/waiting-list')
        .send({
          name: 'Ada Lovelace',
          email: 'ada@email.com',
          phoneNumber: '11999991234',
          companyName: 'Company',
        })
        .expect(201)
        .then(async (response) => {
          const waitingCompanyId = response.body.waitingCompanyCreated.id;
          expect(response.body).toMatchObject({
            waitingCompanyCreated: {
              id: expect.any(String),
              name: 'Ada Lovelace',
              email: 'ada@email.com',
              phoneNumber: '5511999991234',
              companyName: 'Company',
            },
          });

          await prismaClient.waitingCompany.delete({
            where: {
              id: waitingCompanyId,
            },
          });
        });
    });

    it('should error if try create waitingCompany without name', async () => {
      return request(app.getHttpServer())
        .post('/waiting-list')
        .send({
          name: '',
          email: 'ada@email.com',
          phoneNumber: '11999991234',
          companyName: 'Company',
        })
        .expect(400)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            error: 'Bad Request',
            message: ['Required field'],
          });
        });
    });

    it('should error if try create waitingCompany without email', async () => {
      return request(app.getHttpServer())
        .post('/waiting-list')
        .send({
          name: 'Ada Lovelace',
          email: '',
          phoneNumber: '11999991234',
          companyName: 'Company',
        })
        .expect(400)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            error: 'Bad Request',
            message: ['Inform a valid email', 'Required field'],
          });
        });
    });
  });

  it('should error if try create waitingCompany without phoneNumber', async () => {
    return request(app.getHttpServer())
      .post('/waiting-list')
      .send({
        name: 'Ada Lovelace',
        email: 'ada@email.com',
        phoneNumber: '',
        companyName: 'Company',
      })
      .expect(400)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          error: 'Bad Request',
          message: ['Required field'],
        });
      });
  });

  it('should error if try create waitingCompany without companyName', async () => {
    return request(app.getHttpServer())
      .post('/waiting-list')
      .send({
        name: 'Ada Lovelace',
        email: 'ada@email.com',
        phoneNumber: '11999991234',
        companyName: '',
      })
      .expect(400)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          error: 'Bad Request',
          message: ['Required field'],
        });
      });
  });

  it('should error if try create waitingCompany without email already used', async () => {
    return request(app.getHttpServer())
      .post('/waiting-list')
      .send({
        name: 'Ada Lovelace',
        email: 'morganna@email.com',
        phoneNumber: '11999991234',
        companyName: 'Company',
      })
      .expect(409)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          message: 'User already in waiting list',
        });
      });
  });

  it('should error if try create waitingCompany without phoneNumber already used', async () => {
    return request(app.getHttpServer())
      .post('/waiting-list')
      .send({
        name: 'Ada Lovelace',
        email: 'ada@email.com',
        phoneNumber: '11999998888',
        companyName: 'Company',
      })
      .expect(409)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          message: 'User already in waiting list',
        });
      });
  });
});
