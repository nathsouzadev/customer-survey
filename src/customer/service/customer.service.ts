import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../repository/customer.repository';
import { Customer, CustomerAnswer } from '@prisma/client';
import { CustomerAnswerRepository } from '../repository/customerAnswer.repository';
import { CustomerSurveyRepository } from '../repository/customerSurvey.repository';
import { CustomerSurveyModel } from '../model/customerSurvey.model';
import { CustomerAnswersRequestModel } from '../model/customerAnswerRequest.model';
import { CreateCustomerRequestDTO } from '../dto/createCustomerRequest.dto';
import { AppLogger } from '../../utils/appLogger';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly customerAnswerRepository: CustomerAnswerRepository,
    private readonly customerSurveyRepository: CustomerSurveyRepository,
    private readonly logger: AppLogger
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

  createCustomer = async(createCustomerRequest: CreateCustomerRequestDTO) => {
    const customer = await this.getCustomer(createCustomerRequest.phoneNumber)

    if(customer){
      this.logger.errors('Customer already exists', CustomerService.name)
      throw new Error('Customer already exists')
    }
    return this.customerRepository.createCustomer(createCustomerRequest)
  }
}
