import { AppLogger } from '../../utils/appLogger';
import { PrismaWaitingCompanyRepository } from '../../waitingList/repository/prisma/prismaWaitingCompany.repository';
import { WaitingCompanyRepository } from '../../waitingList/repository/waitingCompany.repository';

export const waitingListProviders = [
  {
    provide: WaitingCompanyRepository,
    useClass: PrismaWaitingCompanyRepository,
  },
  AppLogger,
];
