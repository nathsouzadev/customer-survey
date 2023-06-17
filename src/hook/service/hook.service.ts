import { Injectable } from '@nestjs/common';
import { TwilioService } from '../../client/twilio/twilio.service';
import { MessageModel } from '../../model/message.model';
import { MessageResponseModel } from '../../model/message.response.model';
import { SurveyService } from '../../survey/service/survey.service';
import { CustomerService } from '../../customer/service/customer.service';
import { SendSurveyModel } from '../models/sendSurvey.model';

@Injectable()
export class HookService {
  constructor(
    private readonly client: TwilioService,
    private readonly surveyService: SurveyService,
    private readonly customerService: CustomerService,
  ) {}

  sendMessage = async (
    messageReceived: MessageModel,
  ): Promise<MessageResponseModel> => {
    const isValid: boolean = ['1', '2', '3'].includes(messageReceived.Body);

    if (isValid) {
      const answer = await this.surveyService.addAnswerToSurvey({
        answer: messageReceived.Body,
        customer: messageReceived.WaId,
      });
      return this.client.replyToUser({
        message: messageReceived,
        isValid,
        replyMessage: answer.nextQuestion ? answer.nextQuestion : null,
      });
    }

    return this.client.replyToUser({
      message: messageReceived,
      isValid,
      replyMessage: null,
    });
  };

  sendSurvey = async (surveyId: string): Promise<SendSurveyModel> => {
    const customersToSend = await this.customerService.getCustomersBySurveyId(
      surveyId,
    );
    const { question } = await this.surveyService.getFirstQuestionBySurveyId(
      surveyId,
    );

    for (const survey of customersToSend) {
      await this.client.sendFirstMessage({
        customerPhone: survey.customer.phoneNumber,
        body: question,
      });
    }

    return {
      surveySent: {
        surveyId,
        status: 'sent',
        totalCustomers: customersToSend.length,
      },
    };
  };
}
