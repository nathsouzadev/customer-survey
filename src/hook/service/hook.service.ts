import { Injectable } from '@nestjs/common';
import { SurveyService } from '../../survey/service/survey.service';
import { CustomerService } from '../../customer/service/customer.service';
import { SendSurveyModel } from '../models/sendSurvey.model';
import { WBService } from '../../client/wb/wb.service';
import { CompanyService } from '../../company/service/company.service';
import {
  MessageReceived,
  QuickReplyReceived,
} from '../models/messageData.model';
import { SendSurveyRequest } from '../models/sendSurveyRequest.model';
import { getSurveyTemplate } from '../templates/survey.template';

enum ReplyMessage {
  finish = 'Obrigada pela sua resposta!',
  invalid = 'Por favor responda apenas com o número de uma das alternativas',
}

@Injectable()
export class HookService {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly customerService: CustomerService,
    private readonly companyService: CompanyService,
    private readonly wbService: WBService,
  ) {}

  sendFirstQuestionFromSurvey = async (
    quickReply: QuickReplyReceived,
  ): Promise<{ messageId: string }> => {
    const customerPhoneNumber = quickReply.messages[0].from;
    const customer = await this.customerService.getSurvey(customerPhoneNumber);
    const message = await this.surveyService.getFirstQuestionBySurveyId(
      customer.surveyId,
    );
    const messageSent = await this.wbService.sendMessage({
      sender: quickReply.metadata.phone_number_id,
      receiver: customerPhoneNumber,
      message: message.question,
    });
    return { messageId: messageSent.messages[0].id };
  };

  sendMessage = async (
    receivedMessage: MessageReceived,
  ): Promise<{ messageId: string }> => {
    const messageBody = receivedMessage.messages[0].text.body;
    const customer = receivedMessage.messages[0].from;
    const isValid: boolean = ['1', '2', '3'].includes(messageBody);

    if (isValid) {
      const answer = await this.surveyService.addAnswerToSurvey({
        answer: messageBody,
        customer,
      });
      const messageSent = await this.wbService.sendMessage({
        sender: receivedMessage.metadata.phone_number_id,
        receiver: customer,
        message: answer.nextQuestion ?? ReplyMessage.finish,
      });

      return { messageId: messageSent.messages[0].id };
    }

    const messageSent = await this.wbService.sendMessage({
      sender: receivedMessage.metadata.phone_number_id,
      receiver: customer,
      message: ReplyMessage.invalid,
    });
    return { messageId: messageSent.messages[0].id };
  };

  sendSurvey = async (
    surveyData: SendSurveyRequest,
  ): Promise<SendSurveyModel> => {
    const { surveyId, companyId, name } = surveyData;
    const customersToSend = await this.customerService.getCustomersBySurveyId(
      surveyId,
    );

    if (customersToSend.length > 0) {
      const { phoneNumber } = await this.companyService.getPhoneByCompanyId(
        companyId,
      );

      for (const survey of customersToSend) {
        await this.wbService.sendMessage(
          getSurveyTemplate({
            receiver: survey.customer.phoneNumber,
            sender: phoneNumber,
            company: name,
          }),
        );
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
