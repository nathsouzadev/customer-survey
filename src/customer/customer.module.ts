import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PrismaService } from '../client/prisma/prisma.service';
import { CustomerRepository } from './repository/customer.repository';
import { PrismaCustomerRepository } from './repository/prisma/prismaCustomer.repository';

@Module({
  providers: [
    CustomerService,
    PrismaService,
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    },
  ],
})
export class CustomerModule {}
