import { CustomerSurveyModel } from '../model/customerSurvey.model';

export abstract class CustomerSurveyRepository {
  abstract getSurveyByCustomerId(
    customerId: string,
  ): Promise<CustomerSurveyModel>;
}
