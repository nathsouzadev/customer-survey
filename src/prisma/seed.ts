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
  {
    id: 'e1347b38-dfcd-42a3-894c-42ccfc35a54f',
    name: 'Katherine Johnson',
    phoneNumber: '5511999992221',
  },
  {
    id: '74c6d4b8-dc06-4229-b3bf-46938f47861a',
    name: 'Hedy Lamarr',
    phoneNumber: '5511999992220',
  },
  {
    id: 'dd897118-472e-436c-9ba0-ced800a2eff4',
    name: 'Roberta Williams',
    phoneNumber: '5511999992223',
  },
  {
    id: '5e4e10f1-033a-4cf2-8521-c5d5b1ec2a00',
    name: 'Frances Allen',
    phoneNumber: '5511999992224',
  },
  {
    id: '29c7cdb6-3672-4f65-9caa-d026d982f479',
    name: 'Carol Shaw',
    phoneNumber: '5511999992225',
  }
];

const customerAnswers = [
  {
    id: '024581ec-732a-41c6-a8c6-9ea4c5d0c0ae',
    customerId: '492f8f28-75f0-4bdf-ac75-f4487d2d0d39',
    answer: 'bom'
  },
  {
    id: 'cdc429ec-e3d1-48ee-8e69-e3056a6670d6',
    customerId: 'e1347b38-dfcd-42a3-894c-42ccfc35a54f',
    answer: 'bom'
  },
  {
    id: '662be176-afb8-4596-a378-76ae20776e67',
    customerId: '74c6d4b8-dc06-4229-b3bf-46938f47861a',
    answer: 'bom'
  },
  {
    id: '4eddd456-8650-433c-844a-f3269aa14453',
    customerId: 'dd897118-472e-436c-9ba0-ced800a2eff4',
    answer: 'regular'
  },
  {
    id: '5c271ae2-0ef3-49fe-a822-c49122ec6a84',
    customerId: '5e4e10f1-033a-4cf2-8521-c5d5b1ec2a00',
    answer: 'regular'
  },
  {
    id: 'a9bfcb16-7bc6-4c7b-b04c-ac4433721449',
    customerId: '29c7cdb6-3672-4f65-9caa-d026d982f479',
    answer: 'ruim'
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
