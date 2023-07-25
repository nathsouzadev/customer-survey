import { Test, TestingModule } from '@nestjs/testing';
import { WBService } from './wb.service';
import { AppLogger } from '../../utils/appLogger';
import nock from 'nock';

describe('WBService', () => {
  let service: WBService;
  const mockUrl = 'https://graph.facebook.com/v17.0';
  process.env.WB_URL = mockUrl;
  process.env.WHATSAPP_TOKEN = 'TOKEN';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WBService, AppLogger],
    }).compile();

    service = module.get<WBService>(WBService);
  });

  it('should send message', async () => {
    const mockCompanyPhone = '5511999991111';
    const mockReceiverPhone = '5511999991110';
    nock(`${mockUrl}/${mockCompanyPhone}/messages`)
      .post('')
      .reply(200, {
        messaging_product: 'whatsapp',
        contacts: [
          {
            input: mockReceiverPhone,
            wa_id: mockReceiverPhone,
          },
        ],
        messages: [
          {
            id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
          },
        ],
      });

    const response = await service.sendMessage({
      receiver: mockReceiverPhone,
      sender: mockCompanyPhone,
      message: 'Reply',
    });
    expect(response).toMatchObject({
      messaging_product: 'whatsapp',
      contacts: [
        {
          input: mockReceiverPhone,
          wa_id: mockReceiverPhone,
        },
      ],
      messages: [
        {
          id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
        },
      ],
    });
  });

  it('should send template message', async () => {
    const mockCompanyPhone = '5511999991111';
    const mockReceiverPhone = '5511999991110';
    nock(`${mockUrl}/${mockCompanyPhone}/messages`)
      .post('')
      .reply(200, {
        messaging_product: 'whatsapp',
        contacts: [
          {
            input: mockReceiverPhone,
            wa_id: mockReceiverPhone,
          },
        ],
        messages: [
          {
            id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
          },
        ],
      });

    const response = await service.sendMessage({
      receiver: mockReceiverPhone,
      sender: mockCompanyPhone,
      type: 'template',
      template: 'survey',
      parameters: [
        {
          type: 'text',
          text: 'Company',
        },
      ],
    });
    expect(response).toMatchObject({
      messaging_product: 'whatsapp',
      contacts: [
        {
          input: mockReceiverPhone,
          wa_id: mockReceiverPhone,
        },
      ],
      messages: [
        {
          id: 'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
        },
      ],
    });
  });
});
