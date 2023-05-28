import { randomUUID } from 'crypto';

export class CustomerAnswerDTO {
  id: string;
  customerId: string;
  answer: string;

  constructor(body: { customerId: string; answer: string }) {
    (this.id = randomUUID()),
      (this.customerId = body.customerId),
      (this.answer = body.answer);
  }
}
