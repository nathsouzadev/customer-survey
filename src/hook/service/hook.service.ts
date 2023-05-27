import { Injectable } from '@nestjs/common';
import { TwilioService } from '../../client/twilio.service';
import { MessageModel } from '../../model/message.model';
import { MessageResponseModel } from '../../model/message.response.model';
import { SurveyService } from '../../survey/service/survey.service';

@Injectable()
export class HookService {
  constructor(
    private readonly client: TwilioService,
    private readonly surveyService: SurveyService,
  ) {}

  sendMessage = async (
    messageReceived: MessageModel,
  ): Promise<MessageResponseModel> => {
    const isValid: boolean = ['1', '2', '3'].includes(messageReceived.Body);

    if (isValid) {
      const answer = this.surveyService.addAnswerToSurvey({
        answer: messageReceived.Body,
        customer: messageReceived.WaId
      });
      return this.client.replyToUser({ 
        message: messageReceived, 
        isValid,
        replyMessage:  answer.customerAnswers < answer.surveyLength ? answer.nextQuestion : null
      })
    }

    return this.client.replyToUser({ message: messageReceived, isValid, replyMessage: null });
  };
}
