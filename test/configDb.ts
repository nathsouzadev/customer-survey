import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient({ log: ['query'] });

const clearDb = async () => {
  await prismaClient.customerAnswer.deleteMany();
  await prismaClient.customer.deleteMany();
};

clearDb();
