import { Injectable } from '@nestjs/common';
import { CustomerRepository } from './repository/customer.repository';
import { Customer, CustomerAnswer } from '@prisma/client';
import { CustomerAnswerRepository } from './repository/customerAnswer.repository';
import { CustomerSurveyRepository } from './repository/customerSurvey.repository';
import { CustomerSurveyModel } from './model/customerSurvey.model';
import { CustomerAnswersRequestModel } from './model/customerAnswerRequest.model';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly customerAnswerRepository: CustomerAnswerRepository,
    private readonly customerSurveyRepository: CustomerSurveyRepository,
  ) {}

  getCustomer = async (phoneNumber: string): Promise<Customer> =>
    this.customerRepository.getCustomerByPhoneNumber(phoneNumber);

  saveCustomerAnswer = async (
    customerAnswer: CustomerAnswer,
  ): Promise<CustomerAnswer> =>
    this.customerAnswerRepository.saveAnswer(customerAnswer);

  getSurvey = async (phoneNumber: string): Promise<CustomerSurveyModel> => {
    const { id: customerId } = await this.getCustomer(phoneNumber);

    return this.customerSurveyRepository.getSurveyByCustomerId(customerId);
  };

  getCustomerAnswersToSurvey = async (
    customerAnswersRequest: CustomerAnswersRequestModel,
  ): Promise<CustomerAnswer[]> =>
    this.customerAnswerRepository.getCustomerAnswersToSurvey(
      customerAnswersRequest,
    );
}
