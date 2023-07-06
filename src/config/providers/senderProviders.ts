import { PrismaSenderRepository } from '../../sender/repository/prisma/prismaSender.repository';
import { SenderRepository } from '../../sender/repository/sender.repository';
import { AppLogger } from '../../utils/appLogger';

export const senderProviders = [
  {
    provide: SenderRepository,
    useClass: PrismaSenderRepository,
  },
  AppLogger,
];
