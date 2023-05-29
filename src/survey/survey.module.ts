import { Module } from '@nestjs/common';
import { SurveyService } from './service/survey.service';
import { SurveyController } from './survey.controller';
import { CustomerModule } from '../customer/customer.module';
import { CustomerAnswerRepository } from '../customer/repository/customerAnswer.repository';
import { PrismaCustomerAnswerRepository } from '../customer/repository/prisma/prismaCustomerAnswer.repository';
import { CustomerService } from '../customer/customer.service';
import { CustomerRepository } from '../customer/repository/customer.repository';
import { PrismaCustomerRepository } from '../customer/repository/prisma/prismaCustomer.repository';
import { PrismaService } from '../client/prisma/prisma.service';
import { CustomerSurveyRepository } from '../customer/repository/customerSurvey.repository';
import { PrismaCustomerSurveyRepository } from '../customer/repository/prisma/prismaCustomerSurvey.repository';
import { SurveyRepository } from './repository/survey.repository';
import { PrismaSurveyRepository } from './repository/prisma/prismaSurvey.repository';

@Module({
  imports: [CustomerModule],
  controllers: [SurveyController],
  providers: [
    SurveyService,
    CustomerService,
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
    {
      provide: SurveyRepository,
      useClass: PrismaSurveyRepository,
    },
    PrismaService,
  ],
})
export class SurveyModule {}
