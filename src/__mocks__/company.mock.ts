import { Company, PhoneCompany, Survey } from '@prisma/client';
import { randomUUID } from 'crypto';

interface CompanyMockReturn extends Company {
  surveys: Survey[];
  phoneNumbers: PhoneCompany[];
}

export const getMockCompany = (companyId: string): CompanyMockReturn => ({
  id: companyId,
  active: true,
  name: 'Company',
  email: 'company@email.com',
  password: 'password',
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
