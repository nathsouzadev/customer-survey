import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PrismaService } from '../client/prisma/prisma.service';
import { CustomerRepository } from './repository/customer.repository';
import { PrismaCustomerRepository } from './repository/prisma/prismaCustomer.repository';
import { CustomerAnswerRepository } from './repository/customerAnswer.repository';
import { PrismaCustomerAnswerRepository } from './repository/prisma/prismaCustomerAnswer.repository';
import { CustomerSurveyRepository } from './repository/customerSurvey.repository';
import { PrismaCustomerSurveyRepository } from './repository/prisma/prismaCustomerSurvey.repository';

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
    {
      provide: CustomerSurveyRepository,
      useClass: PrismaCustomerSurveyRepository,
    },
  ],
})
export class CustomerModule {}
