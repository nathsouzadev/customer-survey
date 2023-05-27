import { Injectable } from '@nestjs/common';
import twilio from 'twilio';
import TwilioClient from 'twilio/lib/rest/Twilio';
import { MessageModel } from '../model/message.model';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { MessageResponseModel } from '../model/message.response.model';

interface MessageData {
  message: MessageModel;
  isValid: boolean;
}

@Injectable()
export class TwilioService {
  client: TwilioClient;

  constructor() {
    this.client = twilio(
      process.env.SERVICE_TWILIO_KEY_SID,
      process.env.SERVICE_TWILIO_KEY_SECRET,
    );
  }

  replyToUser = async (
    messageData: MessageData,
  ): Promise<MessageResponseModel> => {
    const response: MessageInstance = await this.client.messages.create({
      from: process.env.ADMIN_PHONE,
      to: messageData.message.From,
      body: messageData.isValid
        ? 'Obrigada pela sua resposta!'
        : 'Por favor responda apenas com o número de uma das alternativas',
    });

    console.log(messageData.message);
    return {
      body: response.body,
      direction: response.direction,
      from: response.from,
      to: response.to,
      dateUpdated: response.dateUpdated,
      status: response.status,
      sid: response.sid,
    };
  };
}
