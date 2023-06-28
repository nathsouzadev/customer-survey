import { Injectable } from '@nestjs/common';
import { TwilioService } from '../../client/twilio/twilio.service';
import { SurveyService } from '../../survey/service/survey.service';
import { CustomerService } from '../../customer/service/customer.service';
import { SendSurveyModel } from '../models/sendSurvey.model';
import { ReceivedMessageRequestDTO } from '../dto/receivedMessageRequest.dto';
import { WBService } from '../../client/wb/wb.service';

enum ReplyMessage {
  finish = 'Obrigada pela sua resposta!',
  invalid = 'Por favor responda apenas com o número de uma das alternativas',
}

@Injectable()
export class HookService {
  constructor(
    private readonly client: TwilioService,
    private readonly surveyService: SurveyService,
    private readonly customerService: CustomerService,
    private readonly wbService: WBService,
  ) {}

  sendMessage = async (
    receivedMessage: ReceivedMessageRequestDTO,
  ): Promise<{ messageId: string }> => {
    const messageBody =
      receivedMessage.entry[0].changes[0].value.messages[0].text.body;
    const customer = receivedMessage.entry[0].changes[0].value.messages[0].from;
    const isValid: boolean = ['1', '2', '3'].includes(messageBody);

    if (isValid) {
      const answer = await this.surveyService.addAnswerToSurvey({
        answer: messageBody,
        customer,
      });
      const messageSent = await this.wbService.replyToUser({
        sender:
          receivedMessage.entry[0].changes[0].value.metadata.phone_number_id,
        receiver: customer,
        message: answer.nextQuestion ?? ReplyMessage.finish,
      });

      return { messageId: messageSent.messages[0].id };
    }
    const messageSent = await this.wbService.replyToUser({
      sender:
        receivedMessage.entry[0].changes[0].value.metadata.phone_number_id,
      receiver: customer,
      message: ReplyMessage.invalid,
    });
    return { messageId: messageSent.messages[0].id };
  };

  sendSurvey = async (surveyId: string): Promise<SendSurveyModel> => {
    const customersToSend = await this.customerService.getCustomersBySurveyId(
      surveyId,
    );

    if (customersToSend.length > 0) {
      const { question } = await this.surveyService.getFirstQuestionBySurveyId(
        surveyId,
      );

      for (const survey of customersToSend) {
        await this.client.sendFirstMessage({
          customerPhone: survey.customer.phoneNumber,
          body: question,
        });
      }
    }

    return {
      surveySent: {
        surveyId,
        status: customersToSend.length > 0 ? 'sent' : 'no-customers',
        totalCustomers: customersToSend.length,
      },
    };
  };
}
