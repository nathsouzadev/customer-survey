import { Injectable } from '@nestjs/common';
import twilio from 'twilio';
import TwilioClient from 'twilio/lib/rest/Twilio';
import { MessageModel } from '../../model/message.model';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { MessageResponseModel } from '../../model/message.response.model';

enum ReplyMessage {
  finish = 'Obrigada pela sua resposta!',
  invalid = 'Por favor responda apenas com o número de uma das alternativas',
}

interface MessageData {
  message: MessageModel;
  isValid: boolean;
  replyMessage: null | string;
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
        ? messageData.replyMessage ?? ReplyMessage.finish
        : ReplyMessage.invalid,
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
