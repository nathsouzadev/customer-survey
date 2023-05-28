import { CustomerSurvey } from '@prisma/client';

export abstract class CustomerSurveyRepository {
  abstract getSurveyByCustomerId(
    customerId: string,
  ): Promise<CustomerSurvey>;
}
