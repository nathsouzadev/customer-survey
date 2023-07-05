import { Injectable } from '@nestjs/common';
import { SurveyService } from '../../survey/service/survey.service';
import { CustomerService } from '../../customer/service/customer.service';
import { SendSurveyModel } from '../models/sendSurvey.model';
import { WBService } from '../../client/wb/wb.service';
import { CompanyService } from '../../company/service/company.service';
import { MessageReceived } from '../models/messageData.model';

enum ReplyMessage {
  finish = 'Obrigada pela sua resposta!',
  invalid = 'Por favor responda apenas com o número de uma das alternativas',
}

@Injectable()
export class HookService {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly customerService: CustomerService,
    private readonly companyServie: CompanyService,
    private readonly wbService: WBService,
  ) {}

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

  sendSurvey = async (surveyData: {
    surveyId: string;
    companyId: string;
  }): Promise<SendSurveyModel> => {
    const { surveyId, companyId } = surveyData;
    const customersToSend = await this.customerService.getCustomersBySurveyId(
      surveyId,
    );

    if (customersToSend.length > 0) {
      const { phoneNumber } = await this.companyServie.getPhoneByCompanyId(
        companyId,
      );
      const { question } = await this.surveyService.getFirstQuestionBySurveyId(
        surveyId,
      );

      for (const survey of customersToSend) {
        await this.wbService.sendMessage({
          receiver: survey.customer.phoneNumber,
          sender: phoneNumber,
          type: 'template',
          template: 'hello_world',
        });

        await this.wbService.sendMessage({
          receiver: survey.customer.phoneNumber,
          sender: phoneNumber,
          message: question,
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
