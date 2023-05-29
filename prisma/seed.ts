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
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: 'bom'
  },
  {
    id: 'cdc429ec-e3d1-48ee-8e69-e3056a6670d6',
    customerId: 'e1347b38-dfcd-42a3-894c-42ccfc35a54f',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: 'bom'
  },
  {
    id: '662be176-afb8-4596-a378-76ae20776e67',
    customerId: '74c6d4b8-dc06-4229-b3bf-46938f47861a',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: 'bom'
  },
  {
    id: '4eddd456-8650-433c-844a-f3269aa14453',
    customerId: 'dd897118-472e-436c-9ba0-ced800a2eff4',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: 'regular'
  },
  {
    id: '5c271ae2-0ef3-49fe-a822-c49122ec6a84',
    customerId: '5e4e10f1-033a-4cf2-8521-c5d5b1ec2a00',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: 'regular'
  },
  {
    id: 'a9bfcb16-7bc6-4c7b-b04c-ac4433721449',
    customerId: '29c7cdb6-3672-4f65-9caa-d026d982f479',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: 'ruim'
  }
]

const survey = {
  id: '2f578a7b-8930-4a1b-8998-f15142a090b7',
  name: 'Survey',
  title: 'Example Survey'
}

const customerSurveys = [
  {
    id: '3fa78c6b-d18f-4900-9c2d-498982ab0d80',
    active: true,
    customerId: 'eb05a7a9-3c5b-460f-866b-1dbd321f38b6',
    surveyId: '2f578a7b-8930-4a1b-8998-f15142a090b7'
  },
  {
    id: '46ab7918-aee1-4d56-8d9a-de415aff17be',
    active: true,
    customerId: '492f8f28-75f0-4bdf-ac75-f4487d2d0d39',
    surveyId: '2f578a7b-8930-4a1b-8998-f15142a090b7'
  }
]

const questions = [
  {
    id: '310db204-c0bb-4454-8424-d8783f99afb1',
    surveyId: '2f578a7b-8930-4a1b-8998-f15142a090b7',
    question: 'Question 2',
    order: 2
  },
  {
    id: '35958c5c-bcaf-4851-803b-27c3f837624f',
    surveyId: '2f578a7b-8930-4a1b-8998-f15142a090b7',
    question: 'Question 1',
    order: 1
  }
]

const questionAnswers = [
  {
    id: 'bbca8ea8-3d40-406b-a38d-6e246db34700',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: '1',
    label: 'bom'
  },
  {
    id: '55a65cac-778f-4bb3-91dd-db4bc9ab4cda',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: '2',
    label: 'regular'
  },
  {
    id: '41b5e1a8-71c8-4b58-a85d-ee3c01acc28b',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: '3',
    label: 'ruim'
  },
  {
    id: 'c8674c5f-238f-4d69-b3b7-9c65e1018fa1',
    questionId: '310db204-c0bb-4454-8424-d8783f99afb1',
    answer: '1',
    label: 'bom'
  },
  {
    id: 'e82f346a-2d35-4f76-8136-f1d9859e84ae',
    questionId: '310db204-c0bb-4454-8424-d8783f99afb1',
    answer: '2',
    label: 'regular'
  },
  {
    id: '9487c101-8c57-4778-a30c-f53c7a0f5d3d',
    questionId: '310db204-c0bb-4454-8424-d8783f99afb1',
    answer: '3',
    label: 'ruim'
  }
]

const prisma = new PrismaClient({ log: ['query'] });

const main = async() => {
  for (const customer of customers){
    await prisma.customer.create({
      data: customer
    })
  }

  await prisma.survey.create({
    data: survey
  })

  for (const customerSurvey of customerSurveys){
    await prisma.customerSurvey.create({
      data: customerSurvey
    })
  }

  for (const question of questions){
    await prisma.question.create({
      data: question
    })
  }

  for (const questionAnswer of questionAnswers){
    await prisma.questionAnswer.create({
      data: questionAnswer
    })
  }

  for (const answer of customerAnswers){
    await prisma.customerAnswer.create({
      data: answer
    })
  }
}

main()
