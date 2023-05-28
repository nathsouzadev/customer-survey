import { Injectable } from '@nestjs/common';
import { CustomerAnswerModel } from './model/customerAnswer.model';
import { CustomerService } from '../customer/customer.service';
import { CustomerAnswerRepository } from './repository/customerAnswer.repository';
import { CustomerAnswerDTO } from './dto/customerAnser.dto';
import { SaveCustomerAnswer } from './model/saveCustomerAnswer.model';

@Injectable()
export class CustomerAnswerService {

  constructor(
    private readonly customerAnswerRepository: CustomerAnswerRepository,
    private readonly customerService: CustomerService
  ){}

  saveCustomerAnswer = async(customerAnswer: CustomerAnswerModel): Promise<SaveCustomerAnswer> => {
    const { id: customerId } = await this.customerService.getCustomer(customerAnswer.customer)

    const answer = new CustomerAnswerDTO({
      customerId,
      answer: customerAnswer.answer
    })
    
    const savedAnswer = await this.customerAnswerRepository.saveAnswer(answer)

    const customerAnswers = await this.customerAnswerRepository.getAnswersByCustomerId(customerId)

    return {
      answer: savedAnswer,
      totalAnswers: customerAnswers.length
    }
  }
}
