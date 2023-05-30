import { Module } from '@nestjs/common';
import { HookController } from './hook.controller';
import { HookService } from './service/hook.service';
import { TwilioService } from '../client/twilio/twilio.service';
import { SurveyService } from '../survey/service/survey.service';
import { CustomerAnswerRepository } from '../customer/repository/customerAnswer.repository';
import { PrismaCustomerAnswerRepository } from '../customer/repository/prisma/prismaCustomerAnswer.repository';
import { CustomerService } from '../customer/customer.service';
import { CustomerRepository } from '../customer/repository/customer.repository';
import { PrismaCustomerRepository } from '../customer/repository/prisma/prismaCustomer.repository';
import { CustomerModule } from '../customer/customer.module';
import { PrismaService } from '../client/prisma/prisma.service';
import { CustomerSurveyRepository } from '../customer/repository/customerSurvey.repository';
import { PrismaCustomerSurveyRepository } from '../customer/repository/prisma/prismaCustomerSurvey.repository';
import { SurveyRepository } from '../survey/repository/survey.repository';
import { PrismaSurveyRepository } from '../survey/repository/prisma/prismaSurvey.repository';

@Module({
  imports: [CustomerModule],
  controllers: [HookController],
  providers: [
    HookService,
    SurveyService,
    TwilioService,
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
export class HookModule {}
