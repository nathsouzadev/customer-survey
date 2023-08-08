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
import { ReceivedMessageRequestDTO } from '../dto/receivedMessageRequest.dto';
import { SendSurveyFromSenderRequestDTO } from '../dto/sendSurveyFromSenderRequest.dto';

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

  handlerMessage = async (messageRequest: ReceivedMessageRequestDTO) => {
    const messageData = messageRequest.entry[0].changes[0].value;
    if (
      (Object.keys(messageData).includes('messages') &&
        messageData['messages'][0].type === 'text') ||
      messageData['messages'][0].type === 'button'
    ) {
      if (
        messageData['messages'][0].type === 'text' &&
        messageData['messages'][0].text.body === 'Responder pesquisa'
      ) {
        return this.registerCustomerToSurvey(messageData as MessageReceived);
      }

      if (
        messageData['messages'][0].type === 'button' &&
        messageData['messages'][0].button.payload === 'Quero participar'
      ) {
        return this.receiveOptinFromCustomer(messageData as QuickReplyReceived);
      }
      return this.sendMessage(messageData as MessageReceived);
    }
  };

  receiveOptinFromCustomer = async (
    quickReply: QuickReplyReceived,
  ): Promise<{ messageId: string }> => {
    const customerPhoneNumber = quickReply.messages[0].from;
    const customer = await this.customerService.getSurvey(customerPhoneNumber);
    return this.sendFirstQuestionFromSurvey({
      sender: quickReply.metadata.display_phone_number,
      receiver: customerPhoneNumber,
      phoneNumberId: quickReply.metadata.phone_number_id,
      surveyId: customer.surveyId,
    });
  };

  sendFirstQuestionFromSurvey = async (sendFirstQuestionRequest: {
    sender: string;
    receiver: string;
    phoneNumberId: string;
    surveyId: string;
  }): Promise<{ messageId: string }> => {
    const message = await this.surveyService.getFirstQuestionBySurveyId(
      sendFirstQuestionRequest.surveyId,
    );
    const messageSent = await this.wbService.sendMessage({
      sender: sendFirstQuestionRequest.sender,
      receiver: sendFirstQuestionRequest.receiver,
      message: message.question,
      phoneNumberId: sendFirstQuestionRequest.phoneNumberId,
    });
    return { messageId: messageSent.messages[0].id };
  };

  registerCustomerToSurvey = async (
    receivedMessage: MessageReceived,
  ): Promise<{ messageId: string }> => {
    const customer = receivedMessage.messages[0].from;
    const survey = await this.companyService.getPhoneWithSurvey(
      receivedMessage.metadata.display_phone_number,
    );
    await this.customerService.registerCustomerSurvey({
      name: receivedMessage.contacts[0].profile.name,
      phoneNumber: customer,
      surveyId: survey.company.surveys[0].id,
      companyId: survey.companyId,
    });

    return this.sendFirstQuestionFromSurvey({
      sender: receivedMessage.metadata.display_phone_number,
      receiver: customer,
      phoneNumberId: receivedMessage.metadata.phone_number_id,
      surveyId: survey.company.surveys[0].id,
    });
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
        sender: receivedMessage.metadata.display_phone_number,
        receiver: customer,
        message: answer.nextQuestion ?? ReplyMessage.finish,
        phoneNumberId: receivedMessage.metadata.phone_number_id,
      });

      return { messageId: messageSent.messages[0].id };
    }

    const messageSent = await this.wbService.sendMessage({
      sender: receivedMessage.metadata.display_phone_number,
      receiver: customer,
      message: ReplyMessage.invalid,
      phoneNumberId: receivedMessage.metadata.phone_number_id,
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
      const { phoneNumber, metaId } =
        await this.companyService.getPhoneByCompanyId(companyId);

      for (const survey of customersToSend) {
        await this.wbService.sendMessage(
          getSurveyTemplate({
            receiver: survey.customer.phoneNumber,
            sender: phoneNumber,
            company: name,
            phoneNumberId: metaId,
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

  sendSurveyFromSender = (
    senderSurveyRequest: SendSurveyFromSenderRequestDTO,
  ) => 0;
}
