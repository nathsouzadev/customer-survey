import { Injectable } from '@nestjs/common';
import { TwilioService } from '../../client/twilio.service';
import { MessageModel } from '../../model/message.model';
import { MessageResponseModel } from '../../model/message.response.model';

@Injectable()
export class HookService {
  constructor(private readonly client: TwilioService){}

  sendMessage = async(messageReceived: MessageModel): Promise<MessageResponseModel> => {
    return this.client.sendToTwilio(messageReceived)
  }
}
