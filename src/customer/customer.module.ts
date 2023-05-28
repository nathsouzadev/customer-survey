import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PrismaService } from '../client/prisma/prisma.service';
import { CustomerRepository } from './repository/customer.repository';
import { PrismaCustomerRepository } from './repository/prisma/prismaCustomer.repository';
import { CustomerAnswerRepository } from './repository/customerAnswer.repository';
import { PrismaCustomerAnswerRepository } from './repository/prisma/prismaCustomerAnswer.repository';

@Module({
  providers: [
    CustomerService,
    PrismaService,
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    },
    {
      provide: CustomerAnswerRepository,
      useClass: PrismaCustomerAnswerRepository,
    },
  ],
})
export class CustomerModule {}
