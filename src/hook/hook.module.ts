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
    PrismaService,
  ],
})
export class HookModule {}
