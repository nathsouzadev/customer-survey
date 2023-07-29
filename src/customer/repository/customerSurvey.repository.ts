import { CustomerSurveyModel } from '../model/customerSurvey.model';
import { CustomerRegisteredModel } from '../model/customerRegistered.model';
import { CustomerSurvey } from '@prisma/client';
import { CreateCustomerSurvey } from '../model/createCustomerSurvey.model';

export abstract class CustomerSurveyRepository {
  abstract getSurveyByCustomerId(
    customerId: string,
  ): Promise<CustomerSurveyModel>;

  abstract getCustomersBySurveyId(
    surveyId: string,
  ): Promise<CustomerRegisteredModel[]>;

  abstract createCustomerSurvey(
    customerSurvey: CreateCustomerSurvey,
  ): Promise<CustomerSurvey>;
}
