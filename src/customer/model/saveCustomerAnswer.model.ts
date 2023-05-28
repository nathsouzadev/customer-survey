import { CustomerAnswerDTO } from '../dto/customerAnser.dto';

export interface SaveCustomerAnswer {
  answer: CustomerAnswerDTO;
  totalAnswers: number;
}
