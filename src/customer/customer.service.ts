import { Injectable } from '@nestjs/common';
import { CustomerRepository } from './repository/customer.repository';
import { Customer } from '@prisma/client';
import { SaveCustomerAnswer } from './model/saveCustomerAnswer.model';
import { CustomerAnswerModel } from './model/customerAnswer.model';
import { CustomerAnswerRepository } from './repository/customerAnswer.repository';
import { CustomerAnswerDTO } from './dto/customerAnser.dto';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly customerAnswerRepository: CustomerAnswerRepository,
  ) {}

  getCustomer = async (phoneNumber: string): Promise<Customer> =>
    this.customerRepository.getCustomerByPhoneNumber(phoneNumber);

  saveCustomerAnswer = async (
    customerAnswer: CustomerAnswerModel,
  ): Promise<SaveCustomerAnswer> => {
    const { id: customerId } = await this.getCustomer(customerAnswer.customer);

    const answer = new CustomerAnswerDTO({
      customerId,
      answer: customerAnswer.answer,
    });

    const savedAnswer = await this.customerAnswerRepository.saveAnswer(answer);

    const customerAnswers =
      await this.customerAnswerRepository.getAnswersByCustomerId(customerId);

    return {
      answer: savedAnswer,
      totalAnswers: customerAnswers.length,
    };
  };
}
