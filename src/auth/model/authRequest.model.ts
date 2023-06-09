import { Request } from 'express';
import { CompanyModel } from '../../company/model/company.model';

export interface AuthRequestModel extends Request {
  user: CompanyModel;
}
