import { Module } from '@nestjs/common';
import { CustomerAnswerService } from './customerAnswer.service';
import { CustomerService } from '../customer/customer.service';
import { CustomerModule } from '../customer/customer.module';
import { CustomerRepository } from '../customer/repository/customer.repository';
import { PrismaCustomerRepository } from '../customer/repository/prisma/prismaCustomer.repository';
import { PrismaService } from '../client/prisma/prisma.service';
import { CustomerAnswerRepository } from './repository/customerAnswer.repository';
import { PrismaCustomerAnswerRepository } from './repository/prisma/prismaCustomerAnswer.repository';

@Module({
  imports: [CustomerModule],
  providers: [
    CustomerAnswerService, 
    CustomerService,
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository
    },
    {
      provide: CustomerAnswerRepository,
      useClass: PrismaCustomerAnswerRepository
    },
    PrismaService
  ]
})
export class CustomerAnswerModule {}
