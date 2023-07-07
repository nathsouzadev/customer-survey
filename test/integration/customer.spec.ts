import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getToken } from './aux/token';
import { timeOut } from './aux/timeout';
import { prismaClient } from './aux/prisma';
import { PrismaService } from '../../src/client/prisma/prisma.service';

describe('CustomerController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

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

  describe('Create customer', () => {
    it('should create customer', async () => {
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/company/customer')
        .auth(token, { type: 'bearer' })
        .send({
          name: 'New Customer',
          phoneNumber: '5511999990000',
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
        })
        .expect(201)
        .then(async (response) => {
          const customerId = response.body.id;
          expect(response.body).toMatchObject({
            id: expect.any(String),
            name: 'New Customer',
            phoneNumber: '5511999990000',
            companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
          });

          await prismaClient.customer.delete({
            where: {
              id: customerId,
            },
          });
        });
    });

    it('should not create customer already exists', async () => {
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/company/customer')
        .auth(token, { type: 'bearer' })
        .send({
          name: 'Grace Hooper',
          phoneNumber: '5511999992222',
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
        })
        .expect(409)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            message: 'Customer already exists',
          });
        });
    });

    it('should not create customer with name empty', async () => {
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/company/customer')
        .auth(token, { type: 'bearer' })
        .send({
          name: '',
          phoneNumber: '5511999990000',
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

    it('should not create customer with phoneNumber empty', async () => {
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/company/customer')
        .auth(token, { type: 'bearer' })
        .send({
          name: 'Ada Lovelace',
          phoneNumber: '',
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

    it('should not create customer with compnayId empty', async () => {
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .post('/company/customer')
        .auth(token, { type: 'bearer' })
        .send({
          name: 'Ada Lovelace',
          phoneNumber: '5511999990000',
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

    it('should return 401 when does not have token', async () => {
      return request(app.getHttpServer())
        .post('/company/customer')
        .send({
          name: 'New Customer',
          phoneNumber: '5511999990000',
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
        })
        .expect(401);
    });
  });

  describe('Get customers', () => {
    it('should return all customers with companyId', async () => {
      const token = await getToken(app, request);

      return request(app.getHttpServer())
        .get('/company/customer/8defa50c-1187-49f9-95af-9f1c22ec94af')
        .auth(token, { type: 'bearer' })
        .expect(200)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            customers: expect.any(Array),
          });
          expect(response.body.customers).toHaveLength(9);
        });
    });

    it('should return 401 when does not have token', async () => {
      return request(app.getHttpServer())
        .get('/company/customer/8defa50c-1187-49f9-95af-9f1c22ec94af')
        .expect(401);
    });
  });
});
