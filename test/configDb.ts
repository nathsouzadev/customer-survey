import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient({ log: ['query'] });

const clearDb = async () => {
  await prismaClient.company.deleteMany();
  await prismaClient.customerAnswer.deleteMany();
  await prismaClient.customerSurvey.deleteMany();
  await prismaClient.customer.deleteMany();
  await prismaClient.questionAnswer.deleteMany();
  await prismaClient.question.deleteMany();
  await prismaClient.survey.deleteMany();
};

clearDb();
