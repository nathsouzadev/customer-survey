import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaClient } from '@prisma/client';
import { getToken } from './aux/token';
import { timeOut } from './aux/timeout';

const prismaClient = new PrismaClient({ log: ['query'] });

describe('SenderController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await timeOut();
  });

  describe('Create sender', () => {
    it('should create sender', async () => {
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/company/sender')
        .auth(token, { type: 'bearer' })
        .send({
          name: 'New Sender',
          email: 'new-sender@company.com',
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
        })
        .expect(201)
        .then(async (response) => {
          const senderId = response.body.senderCreated.id;
          expect(response.body).toMatchObject({
            senderCreated: {
              id: expect.any(String),
              name: 'New Sender',
              email: 'new-sender@company.com',
              companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
            },
          });

          await prismaClient.sender.delete({
            where: {
              id: senderId,
            },
          });
        });
    });

    it('should return error if try create sender without name', async () => {
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/company/sender')
        .auth(token, { type: 'bearer' })
        .send({
          name: '',
          email: 'sender@company.com',
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
        })
        .expect(400)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            error: 'Bad Request',
            message: ['Required field'],
          });
        });
    });

    it('should return error if try create sender without email', async () => {
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/company/sender')
        .auth(token, { type: 'bearer' })
        .send({
          name: 'Sender',
          email: '',
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
        })
        .expect(400)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            error: 'Bad Request',
            message: ['Inform a valid email', 'Required field'],
          });
        });
    });

    it('should return error if try create sender without companyId', async () => {
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/company/sender')
        .auth(token, { type: 'bearer' })
        .send({
          name: 'Sender',
          email: 'sender@company.com',
          companyId: '',
        })
        .expect(400)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            error: 'Bad Request',
            message: ['Required field'],
          });
        });
    });

    it('should not create customer already exists', async () => {
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/company/sender')
        .auth(token, { type: 'bearer' })
        .send({
          name: 'Sender',
          email: 'sender@company.com',
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
        })
        .expect(409)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            message: 'Sender already exists',
          });
        });
    });

    it('should return 401 if try create sender without token', async () => {
      return request(app.getHttpServer())
        .post('/company/sender')
        .send({
          name: '',
          email: 'sender@company.com',
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
        })
        .expect(401);
    });
  });
});
