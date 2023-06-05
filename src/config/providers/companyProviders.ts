import { AppLogger } from '../../utils/appLogger';
import { CompanyRepository } from '../../company/repository/company.repository';
import { PrismaCompanyRepository } from '../../company/repository/prisma/prismaCompany.repository';

export const companyProviders = [
  {
    provide: CompanyRepository,
    useClass: PrismaCompanyRepository,
  },
  AppLogger
];
