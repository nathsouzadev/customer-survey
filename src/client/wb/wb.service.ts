import { AppLogger } from '../../utils/appLogger';
import axios from 'axios';
import { MessageSentModel } from './models/messageSent.model';
import { Injectable } from '@nestjs/common';

interface MessageData {
  receiver: string;
  sender: string;
  message: string;
}

interface TemplateData {
  receiver: string;
  sender: string;
  type: string;
  template: string;
}

@Injectable()
export class WBService {
  constructor(private readonly logger: AppLogger) {}

  sendMessage = async (
    messageData: MessageData | TemplateData,
  ): Promise<MessageSentModel> => {
    const response = await axios({
      method: 'POST',
      url:
        'https://graph.facebook.com/v17.0/' + messageData.sender + '/messages',
      data: Object.keys(messageData).includes['template']
        ? {
            messaging_product: 'whatsapp',
            to: messageData.receiver,
            type: 'template',
            template: {
              name: messageData['template'],
              language: {
                code: 'en_US',
              },
            },
          }
        : {
            messaging_product: 'whatsapp',
            to: messageData.receiver,
            text: {
              body: messageData['message'],
            },
          },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      },
    });

    this.logger.logger(
      {
        requestData: response.data,
        message: 'Reply sent to user',
      },
      WBService.name,
    );

    return response.data;
  };
}
