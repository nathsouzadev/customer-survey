import { AppLogger } from '../../utils/appLogger';
import axios from 'axios';
import { MessageSentModel } from './models/messageSent.model';
import { Injectable } from '@nestjs/common';
import { MessageData } from './models/messageData.model';
import { TemplateData } from './models/templateData.model';

@Injectable()
export class WBService {
  constructor(private readonly logger: AppLogger) {}

  sendMessage = async (
    messageData: MessageData | TemplateData,
  ): Promise<MessageSentModel> => {
    const response = await axios({
      method: 'POST',
      url:
        'https://graph.facebook.com/v17.0/' +
        process.env.ADMIN_PHONE +
        '/messages',
      data: Object.keys(messageData).includes['template']
        ? {
            messaging_product: 'whatsapp',
            to: messageData.receiver,
            type: 'template',
            template: {
              name: messageData['template'],
              language: {
                code: 'pt_BR',
              },
              components: [
                {
                  type: 'body',
                  parameters: messageData['parameters'],
                },
              ],
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
