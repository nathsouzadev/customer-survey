import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const phoneNumbers = []
const prisma = new PrismaClient({ log: ['query'] });

const main = async() => {
  for (const phoneNumber of phoneNumbers){
    const customerId = randomUUID()
    await prisma.customer.create({
      data: {
        id: customerId,
        name: 'Ada Lovelace',
        phoneNumber
      }
    })

    await prisma.customerSurvey.create({
      data: {
        id: randomUUID(),
        active: true,
        customerId,
        surveyId: '8877e6db-f816-4d67-98cc-629685645c83'
      }
    })
  }}

main()
