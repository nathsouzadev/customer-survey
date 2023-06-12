import { Module } from '@nestjs/common';
import { CustomerService } from './service/customer.service';
import { PrismaService } from '../client/prisma/prisma.service';
import { customerProviders } from '../config/providers/customerProviders';
import { CustomerController } from './customer.controller';
import { AppLogger } from '../utils/appLogger';

@Module({
  providers: [CustomerService, PrismaService, AppLogger, ...customerProviders],
  controllers: [CustomerController],
})
export class CustomerModule {}
