import { CustomerSurveyModel } from '../model/customerSurvey.model';
import { CustomerRegisteredModel } from '../model/customerRegistered.mode';

export abstract class CustomerSurveyRepository {
  abstract getSurveyByCustomerId(
    customerId: string,
  ): Promise<CustomerSurveyModel>;

  abstract getCustomersBySurveyId(
    surveyId: string,
  ): Promise<CustomerRegisteredModel[]>;
}
