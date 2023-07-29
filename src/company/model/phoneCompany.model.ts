import { CompanyModel } from './company.model';

export class PhoneCompanyWithSurvey {
  id: string;
  active: boolean;
  phoneNumber: string;
  metaId: string;
  companyId: string;
  company: PhoneCompanyModel;
}

class PhoneCompanyModel extends CompanyModel {
  surveys: SurveyModel[];
}

class SurveyModel {
  id: string;
  companyId: string;
  name: string;
  title: string;
}
