import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/client/prisma/prisma.service';

describe('CompanyController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  process.env.TOKEN = 'dev-secret';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
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
