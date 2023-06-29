import { AppLogger } from '../../utils/appLogger';
import { CompanyRepository } from '../../company/repository/company.repository';
import { PrismaCompanyRepository } from '../../company/repository/prisma/prismaCompany.repository';
import { PhoneCompanyRepository } from '../../company/repository/phoneCompany.repository';
import { PrismaPhoneCompanyRepository } from '../../company/repository/prisma/prismaPhoneCompany.repository';

export const companyProviders = [
  {
    provide: CompanyRepository,
    useClass: PrismaCompanyRepository,
  },
  {
    provide: PhoneCompanyRepository,
    useClass: PrismaPhoneCompanyRepository,
  },
  AppLogger,
];
