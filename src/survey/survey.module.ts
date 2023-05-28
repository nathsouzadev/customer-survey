import { Module } from '@nestjs/common';
import { SurveyService } from './service/survey.service';
import { SurveyController } from './survey.controller';
import { CustomerAnswerService } from '../customerAnswer/customerAnswer.service';
import { CustomerAnswerModule } from '../customerAnswer/customerAnswer.module';
import { CustomerAnswerRepository } from '../customerAnswer/repository/customerAnswer.repository';
import { PrismaCustomerAnswerRepository } from '../customerAnswer/repository/prisma/prismaCustomerAnswer.repository';
import { CustomerService } from '../customer/customer.service';
import { CustomerRepository } from '../customer/repository/customer.repository';
import { PrismaCustomerRepository } from '../customer/repository/prisma/prismaCustomer.repository';
import { PrismaService } from '../client/prisma/prisma.service';

@Module({
  imports: [CustomerAnswerModule],
  controllers: [SurveyController],
  providers: [
    SurveyService, 
    CustomerAnswerService,
    {
      provide: CustomerAnswerRepository,
      useClass: PrismaCustomerAnswerRepository,
    },
    CustomerService,
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    },
    PrismaService
  ],
})
export class SurveyModule {}
