import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { mockReceivedMessageFromMeta } from '../../src/__mocks__/metaReceivedMessage.mock';
import nock from 'nock';
import { randomUUID } from 'crypto';
import { prismaClient } from './aux/prisma';

describe('AppController', () => {
  let app: INestApplication;

  const mockUrl = 'https://graph.facebook.com/v17.0';
  process.env.WB_URL = mockUrl;
  const mockPhoneNumberId = '1234567890';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('receive message from meta', () => {
    it('send next question when user do not finish survey', async () => {
      const mockCompanyPhone = '12345678900';
      const mockCustomerPhone = '5511999991111';
      nock(`${mockUrl}/${mockPhoneNumberId}/messages`)
        .post('')
        .reply(200, {
          messaging_product: 'whatsapp',
          contacts: [
            {
              input: mockCustomerPhone,
              wa_id: mockCustomerPhone,
            },
          ],
          messages: [
            {
              id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          ],
        });
      return request(app.getHttpServer())
        .post('/meta')
        .send(
          mockReceivedMessageFromMeta({
            message: '1',
            receiver: mockCompanyPhone,
            sender: mockCustomerPhone,
            type: 'message',
            phoneNumberId: mockPhoneNumberId,
          }),
        )
        .expect(200)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            status: 'ok',
            response: {
              messageId:
                'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          });

          const answer = await prismaClient.customerAnswer.findFirst({
            where: {
              customerId: 'eb05a7a9-3c5b-460f-866b-1dbd321f38b6',
            },
          });

          expect(answer).toMatchObject({
            id: expect.any(String),
            customerId: 'eb05a7a9-3c5b-460f-866b-1dbd321f38b6',
            answer: 'bom',
          });

          await prismaClient.customerAnswer.delete({
            where: {
              id: answer.id,
            },
          });
        });
    });

    it('send thank message when user finish survey', async () => {
      const mockCompanyPhone = '12345678900';
      const mockCustomerPhone = '5511999992222';
      nock(`${mockUrl}/${mockPhoneNumberId}/messages`)
        .post('')
        .reply(200, {
          messaging_product: 'whatsapp',
          contacts: [
            {
              input: mockCustomerPhone,
              wa_id: mockCustomerPhone,
            },
          ],
          messages: [
            {
              id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          ],
        });
      return request(app.getHttpServer())
        .post('/meta')
        .send(
          mockReceivedMessageFromMeta({
            message: '2',
            receiver: mockCompanyPhone,
            sender: mockCustomerPhone,
            type: 'message',
            phoneNumberId: mockPhoneNumberId,
          }),
        )
        .expect(200)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            status: 'ok',
            response: {
              messageId:
                'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          });

          const answer = await prismaClient.customerAnswer.findMany({
            where: {
              customerId: '492f8f28-75f0-4bdf-ac75-f4487d2d0d39',
            },
          });

          expect(answer[1]).toMatchObject({
            id: expect.any(String),
            customerId: '492f8f28-75f0-4bdf-ac75-f4487d2d0d39',
            answer: 'regular',
          });

          await prismaClient.customerAnswer.delete({
            where: {
              id: answer[1].id,
            },
          });
        });
    });

    it('receive message with invalid body', async () => {
      const mockCompanyPhone = '12345678900';
      const mockCustomerPhone = '5511988885555';
      nock(`${mockUrl}/${mockPhoneNumberId}/messages`)
        .post('')
        .reply(200, {
          messaging_product: 'whatsapp',
          contacts: [
            {
              input: mockCustomerPhone,
              wa_id: mockCustomerPhone,
            },
          ],
          messages: [
            {
              id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          ],
        });
      return request(app.getHttpServer())
        .post('/meta')
        .send(
          mockReceivedMessageFromMeta({
            message: 'Invalid body',
            receiver: mockCompanyPhone,
            sender: mockCustomerPhone,
            type: 'message',
            phoneNumberId: mockPhoneNumberId,
          }),
        )
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({
            status: 'ok',
            response: {
              messageId:
                'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          });
        });
    });

    it('receive message with optin from customer to survey', () => {
      const mockCompanyPhone = '551199991234';
      const mockCustomerPhone = '5511999991111';
      nock(`${mockUrl}/${mockPhoneNumberId}/messages`)
        .post('')
        .reply(200, {
          messaging_product: 'whatsapp',
          contacts: [
            {
              input: mockCustomerPhone,
              wa_id: mockCustomerPhone,
            },
          ],
          messages: [
            {
              id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          ],
        });

      return request(app.getHttpServer())
        .post('/meta')
        .send(
          mockReceivedMessageFromMeta({
            message: 'Quero participar',
            receiver: mockCompanyPhone,
            sender: mockCustomerPhone,
            phoneNumberId: mockPhoneNumberId,
            type: 'quickReply',
          }),
        )
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({
            status: 'ok',
            response: {
              messageId:
                'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          });
        });
    });

    it('receive message without optin from customer to survey', () => {
      const mockCompanyPhone = '551199991234';
      const mockCustomerPhone = '5511999991111';
      nock(`${mockUrl}/${mockPhoneNumberId}/messages`)
        .post('')
        .reply(200, {
          messaging_product: 'whatsapp',
          contacts: [
            {
              input: mockCustomerPhone,
              wa_id: mockCustomerPhone,
            },
          ],
          messages: [
            {
              id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          ],
        });

      return request(app.getHttpServer())
        .post('/meta')
        .send(
          mockReceivedMessageFromMeta({
            message: 'Não quero participar',
            receiver: mockCompanyPhone,
            sender: mockCustomerPhone,
            phoneNumberId: mockPhoneNumberId,
            type: 'quickReply',
          }),
        )
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({
            status: 'ok',
          });
        });
    });

    it('receive message with "Responder pesquisa" from customer', () => {
      const mockCompanyPhone = '551199991234';
      const mockCustomerPhone = '5511999992225';
      nock(`${mockUrl}/${mockPhoneNumberId}/messages`)
        .post('')
        .reply(200, {
          messaging_product: 'whatsapp',
          contacts: [
            {
              input: mockCustomerPhone,
              wa_id: mockCustomerPhone,
            },
          ],
          messages: [
            {
              id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          ],
        });

      return request(app.getHttpServer())
        .post('/meta')
        .send(
          mockReceivedMessageFromMeta({
            message: 'Responder pesquisa',
            receiver: mockCompanyPhone,
            sender: mockCustomerPhone,
            phoneNumberId: mockPhoneNumberId,
            type: 'message',
          }),
        )
        .expect(200)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            status: 'ok',
            response: {
              messageId:
                'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          });

          const customerSurvey = await prismaClient.customerSurvey.findFirst({
            where: {
              customerId: '29c7cdb6-3672-4f65-9caa-d026d982f479',
            },
          });

          expect(customerSurvey).toMatchObject({
            id: expect.any(String),
            active: true,
            customerId: '29c7cdb6-3672-4f65-9caa-d026d982f479',
            surveyId: '29551fe2-3059-44d9-ab1a-f5318368b88f',
          });

          await prismaClient.customerSurvey.delete({
            where: {
              id: customerSurvey.id,
            },
          });
        });
    });

    it('receive message with "Responder pesquisa" from customer not exists', () => {
      const mockCompanyPhone = '551199991234';
      const mockCustomerPhone = '5511999999999';
      nock(`${mockUrl}/${mockPhoneNumberId}/messages`)
        .post('')
        .reply(200, {
          messaging_product: 'whatsapp',
          contacts: [
            {
              input: mockCustomerPhone,
              wa_id: mockCustomerPhone,
            },
          ],
          messages: [
            {
              id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          ],
        });

      return request(app.getHttpServer())
        .post('/meta')
        .send(
          mockReceivedMessageFromMeta({
            message: 'Responder pesquisa',
            receiver: mockCompanyPhone,
            sender: mockCustomerPhone,
            phoneNumberId: mockPhoneNumberId,
            type: 'message',
          }),
        )
        .expect(200)
        .then(async (response) => {
          expect(response.body).toMatchObject({
            status: 'ok',
            response: {
              messageId:
                'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
            },
          });

          const customer = await prismaClient.customer.findFirst({
            where: {
              phoneNumber: mockCustomerPhone,
            },
          });

          expect(customer).toMatchObject({
            id: expect.any(String),
            name: 'NAME',
            phoneNumber: mockCustomerPhone,
            companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
          });

          const customerSurvey = await prismaClient.customerSurvey.findFirst({
            where: {
              customerId: customer.id,
            },
          });

          expect(customerSurvey).toMatchObject({
            id: expect.any(String),
            active: true,
            customerId: customer.id,
            surveyId: '29551fe2-3059-44d9-ab1a-f5318368b88f',
          });

          await prismaClient.customerSurvey.delete({
            where: {
              id: customerSurvey.id,
            },
          });

          await prismaClient.customer.delete({
            where: {
              id: customer.id,
            },
          });
        });
    });
  });

  describe('activate webhook with Meta', () => {
    const mockToken = randomUUID();
    process.env.WEBHOOK_TOKEN = mockToken;
    const mockChallenge = '1158201444';

    it('should return 200 with challenge', () => {
      return request(app.getHttpServer())
        .get(
          `/meta?hub.mode=subscribe&hub.challenge=${mockChallenge}&hub.verify_token=${mockToken}`,
        )
        .expect(200)
        .then((response) => expect(response.text).toBe(mockChallenge));
    });

    it('should return 401 when have invalid token', () => {
      return request(app.getHttpServer())
        .get(
          `/meta?hub.mode=subscribe&hub.challenge=${mockChallenge}&hub.verify_token=${randomUUID()}`,
        )
        .expect(401);
    });
  });
});
