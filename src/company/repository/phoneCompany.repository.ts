import { PhoneCompany } from '@prisma/client';

export abstract class PhoneCompanyRepository {
  abstract getPhoneByCompanyId(companyId: string): Promise<PhoneCompany>;
}
