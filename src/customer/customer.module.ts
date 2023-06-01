import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PrismaService } from '../client/prisma/prisma.service';
import { customerProviders } from '../config/providers/customerProviders';

@Module({
  providers: [CustomerService, PrismaService, ...customerProviders],
})
export class CustomerModule {}
