import { PhoneCompany } from '@prisma/client';
import { PhoneCompanyWithSurvey } from '../model/phoneCompany.model';

export abstract class PhoneCompanyRepository {
  abstract getPhoneByCompanyId(companyId: string): Promise<PhoneCompany>;

  abstract getPhoneWithSurvey(
    phoneNumber: string,
  ): Promise<PhoneCompanyWithSurvey>;
}
