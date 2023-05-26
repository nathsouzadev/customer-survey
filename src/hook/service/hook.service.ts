import { Injectable } from '@nestjs/common';
import { TwilioService } from '../../client/twilio.service';
import { MessageModel } from '../../model/message.model';
import { MessageResponseModel } from '../../model/message.response.model';
import { AnswerService } from '../../answer/service/answer.service';

@Injectable()
export class HookService {
  constructor(
    private readonly client: TwilioService,
    private readonly answerService: AnswerService  
  ){}

  sendMessage = async(messageReceived: MessageModel): Promise<MessageResponseModel> => {
    const isValid: boolean = ['1', '2', '3'].includes(messageReceived.Body)
    
    if(isValid){
      this.answerService.updateResults(messageReceived.Body)
      return this.client.replyToUser({ message: messageReceived, isValid })
    }
    
    return this.client.replyToUser({ message: messageReceived, isValid })
  }
}
