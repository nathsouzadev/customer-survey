import { Module } from '@nestjs/common';
import { HookController } from './hook.controller';
import { HookService } from './service/hook.service';
import { TwilioService } from '../client/twilio/twilio.service';
import { SurveyService } from '../survey/service/survey.service';
import { CustomerAnswerService } from '../customerAnswer/customerAnswer.service';
import { CustomerAnswerRepository } from '../customerAnswer/repository/customerAnswer.repository';
import { PrismaCustomerAnswerRepository } from '../customerAnswer/repository/prisma/prismaCustomerAnswer.repository';
import { CustomerService } from '../customer/customer.service';
import { CustomerRepository } from '../customer/repository/customer.repository';
import { PrismaCustomerRepository } from '../customer/repository/prisma/prismaCustomer.repository';
import { CustomerAnswerModule } from '../customerAnswer/customerAnswer.module';
import { PrismaService } from '../client/prisma/prisma.service';

@Module({
  imports: [CustomerAnswerModule],
  controllers: [HookController],
  providers: [
    HookService, 
    SurveyService, 
    TwilioService,
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
export class HookModule {}
