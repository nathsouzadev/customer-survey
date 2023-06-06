import { CompanyModel } from '../../company/model/company.model';

export interface AuthRequestModel {
  body: {
    email: string;
    password: string;
  };
  company: CompanyModel;
}
