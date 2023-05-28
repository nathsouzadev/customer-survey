import { CustomerAnswer } from '@prisma/client';

export abstract class CustomerAnswerRepository {
  abstract saveAnswer(customerAnswer: CustomerAnswer): Promise<CustomerAnswer>;

  abstract getAnswersByCustomerId(customerId: string): Promise<CustomerAnswer[]>
}
