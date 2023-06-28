import { AppLogger } from '../../utils/appLogger';
import axios from 'axios';
import { MessageSentModel } from './models/messageSent.model';
import { Injectable } from '@nestjs/common';

interface ReplyData {
  receiver: string;
  sender: string;
  message: string;
}

@Injectable()
export class WBService {
  constructor(private readonly logger: AppLogger) {}

  replyToUser = async (replyData: ReplyData): Promise<MessageSentModel> => {
    const response = await axios({
      method: 'POST',
      url: 'https://graph.facebook.com/v17.0/' + replyData.sender + '/messages',
      data: {
        messaging_product: 'whatsapp',
        to: replyData.receiver,
        text: {
          body: replyData.message,
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
