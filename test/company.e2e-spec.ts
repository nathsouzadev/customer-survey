import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient({ log: ['query'] });

describe('CompanyController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create company', async () => {
    return request(app.getHttpServer())
      .post('/company')
      .send({
        name: 'New Company',
        email: 'new-company@email.com',
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
});
