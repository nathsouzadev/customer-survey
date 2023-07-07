import { Module } from '@nestjs/common';
import { WaitingListService } from './service/waitingList.service';
import { WaitingListController } from './waitingList.controller';
import { waitingListProviders } from '../config/providers/waitingListProviders';
import { PrismaService } from '../client/prisma/prisma.service';

@Module({
  controllers: [WaitingListController],
  providers: [WaitingListService, PrismaService, ...waitingListProviders],
})
export class WaitingListModule {}
