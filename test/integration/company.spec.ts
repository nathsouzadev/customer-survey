import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient({ log: ['query'] });

describe('CompanyController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Create company', () => {
    it('should create company', async () => {
      return request(app.getHttpServer())
        .post('/company')
        .send({
          name: 'New Company',
          email: 'new-company@email.com',
          password: 'password'
        })
        .expect(201)
        .then(async (response) => {
          const companyId = response.body.id;
          console.log(companyId);
          expect(response.body).toMatchObject({
            id: expect.any(String),
            active: true,
            name: 'New Company',
            email: 'new-company@email.com',
          });

          await prismaClient.company.delete({
            where: {
              id: companyId,
            },
          });
        });
    });

    it('should not create company with name empty', async () => {
      return request(app.getHttpServer())
        .post('/company')
        .send({
          name: '',
          email: 'new-company@email.com',
          password: 'password'
        })
        .expect(400)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            error: 'Bad Request',
            message: ['Required field'],
          });
        });
    });

    it('should not create company with passowrd empty', async () => {
      return request(app.getHttpServer())
        .post('/company')
        .send({
          name: 'Company',
          email: 'new-company@email.com',
          password: ''
        })
        .expect(400)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            error: 'Bad Request',
            message: ['Required field'],
          });
        });
    });

    it('should not create company with email empty', async () => {
      return request(app.getHttpServer())
        .post('/company')
        .send({
          name: 'new-company',
          email: '',
          password: 'password'
        })
        .expect(400)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            error: 'Bad Request',
            message: ['Inform a valid email', 'Required field'],
          });
        });
    });

    it('should not create company with invalid email', async () => {
      return request(app.getHttpServer())
        .post('/company')
        .send({
          name: 'new-company',
          email: 'new-company',
          password: 'password'
        })
        .expect(400)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            error: 'Bad Request',
            message: ['Inform a valid email'],
          });
        });
    });

    it('should not create company with email already exists', async () => {
      return request(app.getHttpServer())
        .post('/company')
        .send({
          name: 'new-company',
          email: 'company@email.com',
          password: 'password'
        })
        .expect(500);
    });
  });

  describe('Get company by email', () => {
    it('should get company with email', async () => {
      return request(app.getHttpServer())
        .get('/company/company@email.com')
        .expect(200)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            id: '8defa50c-1187-49f9-95af-9f1c22ec94af',
            active: true,
            name: 'Company',
            email: 'company@email.com',
            surveys: [
              {
                id: '29551fe2-3059-44d9-ab1a-f5318368b88f',
                name: 'Survey',
                title: 'Customer Survey',
                companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
              },
            ],
          });
        });
    });

    it('should return empty object if company does not exists', async () => {
      jest.clearAllMocks();
      return request(app.getHttpServer())
        .get('/company/not-exists@email.com')
        .expect(200)
        .then(async (response) => {
          expect(response.body).toStrictEqual({});
        });
    });
  });
});
