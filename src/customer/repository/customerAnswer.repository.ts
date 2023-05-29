import { CustomerAnswer } from '@prisma/client';
import { CustomerAnswersRequestModel } from '../model/customerAnswerRequest.model';

export abstract class CustomerAnswerRepository {
  abstract saveAnswer(customerAnswer: CustomerAnswer): Promise<CustomerAnswer>;

  abstract getAnswersByCustomerId(
    customerId: string,
  ): Promise<CustomerAnswer[]>;

  abstract getCustomerAnswersToSurvey(
    customerAnswersRequest: CustomerAnswersRequestModel,
  ): Promise<CustomerAnswer[]>;
}
