import { Module } from '@nestjs/common';
import { SenderService } from './service/sender.service';
import { SenderController } from './sender.controller';
import { senderProviders } from '../config/providers/senderProviders';
import { PrismaService } from '../client/prisma/prisma.service';

@Module({
  controllers: [SenderController],
  providers: [SenderService, PrismaService, ...senderProviders],
})
export class SenderModule {}
