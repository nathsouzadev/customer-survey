import { randomUUID } from 'crypto';
import { CompanyModel } from '../company/model/company.model';

export const getMockCompanyModel = (companyId: string): CompanyModel => ({
  id: companyId,
  active: true,
  name: 'Company',
  email: 'company@email.com',
  surveys: [
    {
      id: randomUUID(),
      companyId: companyId,
      name: 'Survey',
      title: 'Main survey',
    },
  ],
  phoneNumbers: [
    {
      id: randomUUID(),
      companyId: companyId,
      active: true,
      phoneNumber: '5511999991234',
      metaId: '1234567890',
    },
  ],
});
