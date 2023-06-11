import { PrismaClient } from '@prisma/client';

const companys = [
  {
    id: '8defa50c-1187-49f9-95af-9f1c22ec94af',
    active: true,
    name: 'Company',
    email: 'company@email.com',
    password: '$2a$08$GkIOV23NZSjVI9Mzr.I6FeZT5HkhgeP3L5CtD636jOSyFxzI9rH1K',
  },
  {
    id: 'b5ff9e3a-9606-4d94-a085-333109e3ff2a',
    active: true,
    name: 'Some Company',
    email: 'some-company@email.com',
    password: '$2a$08$GkIOV23NZSjVI9Mzr.I6FeZT5HkhgeP3L5CtD636jOSyFxzI9rH1K',
  },
];

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
  },
];

const customerAnswers = [
  {
    id: '024581ec-732a-41c6-a8c6-9ea4c5d0c0ae',
    customerId: '492f8f28-75f0-4bdf-ac75-f4487d2d0d39',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: 'bom',
  },
  {
    id: 'cdc429ec-e3d1-48ee-8e69-e3056a6670d6',
    customerId: 'e1347b38-dfcd-42a3-894c-42ccfc35a54f',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: 'bom',
  },
  {
    id: '662be176-afb8-4596-a378-76ae20776e67',
    customerId: '74c6d4b8-dc06-4229-b3bf-46938f47861a',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: 'bom',
  },
  {
    id: '4eddd456-8650-433c-844a-f3269aa14453',
    customerId: 'dd897118-472e-436c-9ba0-ced800a2eff4',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: 'regular',
  },
  {
    id: '5c271ae2-0ef3-49fe-a822-c49122ec6a84',
    customerId: '5e4e10f1-033a-4cf2-8521-c5d5b1ec2a00',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: 'regular',
  },
  {
    id: 'a9bfcb16-7bc6-4c7b-b04c-ac4433721449',
    customerId: '29c7cdb6-3672-4f65-9caa-d026d982f479',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: 'ruim',
  },
];

const surveys = [
  {
    id: '29551fe2-3059-44d9-ab1a-f5318368b88f',
    name: 'Survey',
    title: 'Customer Survey',
    companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
  },
  {
    id: '8efbb69f-2802-475b-9abc-803f635f5ca1',
    name: 'Some Survey',
    title: 'Customer Survey',
    companyId: 'b5ff9e3a-9606-4d94-a085-333109e3ff2a',
  },
];

const customerSurveys = [
  {
    id: '3fa78c6b-d18f-4900-9c2d-498982ab0d80',
    active: true,
    customerId: 'eb05a7a9-3c5b-460f-866b-1dbd321f38b6',
    surveyId: '8efbb69f-2802-475b-9abc-803f635f5ca1',
  },
  {
    id: '46ab7918-aee1-4d56-8d9a-de415aff17be',
    active: true,
    customerId: '492f8f28-75f0-4bdf-ac75-f4487d2d0d39',
    surveyId: '29551fe2-3059-44d9-ab1a-f5318368b88f',
  },
];

const questions = [
  {
    id: '310db204-c0bb-4454-8424-d8783f99afb1',
    surveyId: '29551fe2-3059-44d9-ab1a-f5318368b88f',
    question: 'Question 2',
    order: 2,
  },
  {
    id: '35958c5c-bcaf-4851-803b-27c3f837624f',
    surveyId: '29551fe2-3059-44d9-ab1a-f5318368b88f',
    question: 'Question 1',
    order: 1,
  },
  {
    id: '17ce6710-ab84-4318-8edb-fd62c4ec0290',
    surveyId: '8efbb69f-2802-475b-9abc-803f635f5ca1',
    question: 'Some Question 2',
    order: 2,
  },
  {
    id: 'bef18e97-0505-4424-ad10-08a182ccd638',
    surveyId: '8efbb69f-2802-475b-9abc-803f635f5ca1',
    question: 'Some Question 1',
    order: 1,
  },
];

const questionAnswers = [
  {
    id: 'bbca8ea8-3d40-406b-a38d-6e246db34700',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: '1',
    label: 'bom',
  },
  {
    id: '55a65cac-778f-4bb3-91dd-db4bc9ab4cda',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: '2',
    label: 'regular',
  },
  {
    id: '41b5e1a8-71c8-4b58-a85d-ee3c01acc28b',
    questionId: '35958c5c-bcaf-4851-803b-27c3f837624f',
    answer: '3',
    label: 'ruim',
  },
  {
    id: 'c8674c5f-238f-4d69-b3b7-9c65e1018fa1',
    questionId: '310db204-c0bb-4454-8424-d8783f99afb1',
    answer: '1',
    label: 'bom',
  },
  {
    id: 'e82f346a-2d35-4f76-8136-f1d9859e84ae',
    questionId: '310db204-c0bb-4454-8424-d8783f99afb1',
    answer: '2',
    label: 'regular',
  },
  {
    id: '9487c101-8c57-4778-a30c-f53c7a0f5d3d',
    questionId: '310db204-c0bb-4454-8424-d8783f99afb1',
    answer: '3',
    label: 'ruim',
  },
  {
    id: 'ff767f59-f15b-4891-95c5-f834140bdd34',
    questionId: 'bef18e97-0505-4424-ad10-08a182ccd638',
    answer: '1',
    label: 'bom',
  },
  {
    id: '65698801-4ee8-4da4-9f5c-13179851c9de',
    questionId: 'bef18e97-0505-4424-ad10-08a182ccd638',
    answer: '2',
    label: 'regular',
  },
  {
    id: '74452de1-ef08-4268-8e7c-b6a3292453de',
    questionId: 'bef18e97-0505-4424-ad10-08a182ccd638',
    answer: '3',
    label: 'ruim',
  },
  {
    id: 'ccc18ad3-184d-4d24-bf15-481871a7c655',
    questionId: '17ce6710-ab84-4318-8edb-fd62c4ec0290',
    answer: '1',
    label: 'bom',
  },
  {
    id: '827cdc79-2f73-40de-8372-429284f62f74',
    questionId: '17ce6710-ab84-4318-8edb-fd62c4ec0290',
    answer: '2',
    label: 'regular',
  },
  {
    id: '42c12b36-add5-4028-bc60-110e45bc0c9b',
    questionId: '17ce6710-ab84-4318-8edb-fd62c4ec0290',
    answer: '3',
    label: 'ruim',
  },
];

const prisma = new PrismaClient({ log: ['query'] });

const main = async () => {
  for (const company of companys) {
    await prisma.company.create({
      data: company,
    });
  }

  for (const customer of customers) {
    await prisma.customer.create({
      data: customer,
    });
  }

  for (const survey of surveys){
    await prisma.survey.create({
      data: survey,
    });
  }

  for (const customerSurvey of customerSurveys) {
    await prisma.customerSurvey.create({
      data: customerSurvey,
    });
  }

  for (const question of questions) {
    await prisma.question.create({
      data: question,
    });
  }

  for (const questionAnswer of questionAnswers) {
    await prisma.questionAnswer.create({
      data: questionAnswer,
    });
  }

  for (const answer of customerAnswers) {
    await prisma.customerAnswer.create({
      data: answer,
    });
  }
};

main();
