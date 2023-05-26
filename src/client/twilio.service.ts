import { Injectable } from '@nestjs/common';
import twilio from 'twilio';
import TwilioClient from 'twilio/lib/rest/Twilio';
import { MessageModel } from '../model/message.model';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { MessageResponseModel } from '../model/message.response.model';

@Injectable()
export class TwilioService {
  client: TwilioClient;

  constructor() {
    this.client = twilio(
      process.env.SERVICE_TWILIO_KEY_SID,
      process.env.SERVICE_TWILIO_KEY_SECRET,
    );
  }

  sendToTwilio = async (
    message: MessageModel,
  ): Promise<MessageResponseModel> => {
    const response: MessageInstance = await this.client.messages.create({
      from: process.env.ADMIN_PHONE,
      to: message.From,
      body: 'Obrigada pela sua resposta!',
    });

    console.log(message);
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
