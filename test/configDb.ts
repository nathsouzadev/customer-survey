import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient({ log: ['query'] });

const clearDb = async () => {
  await prismaClient.customerAnswer.deleteMany();
  await prismaClient.customerSurvey.deleteMany();
  await prismaClient.customer.deleteMany();
  await prismaClient.questionAnswer.deleteMany();
  await prismaClient.question.deleteMany();
  await prismaClient.survey.deleteMany();
  await prismaClient.phoneCompany.deleteMany();
  await prismaClient.company.deleteMany();
};

clearDb();
