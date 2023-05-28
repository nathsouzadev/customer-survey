import { PrismaClient } from '@prisma/client';

const customers = [
  {
    id: 'eb05a7a9-3c5b-460f-866b-1dbd321f38b6',
    name: 'Ada Lovelace',
    phoneNumber: '5511999991111',
  },
  {
    id: '492f8f28-75f0-4bdf-ac75-f4487d2d0d39',
    name: 'Grace Hooper',
    phoneNumber: '5511999992222',
  },
];

const customerAnswers = [
  {
    id: '024581ec-732a-41c6-a8c6-9ea4c5d0c0ae',
    customerId: '492f8f28-75f0-4bdf-ac75-f4487d2d0d39',
    answer: 'bom'
  }
]

const prisma = new PrismaClient({ log: ['query'] });

const main = async() => {
  for (const customer of customers){
    await prisma.customer.create({
      data: customer
    })
  }

  for (const answer of customerAnswers){
    await prisma.customerAnswer.create({
      data: answer
    })
  }
}

main()
