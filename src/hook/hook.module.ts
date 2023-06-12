import { Module } from '@nestjs/common';
import { HookController } from './hook.controller';
import { HookService } from './service/hook.service';
import { TwilioService } from '../client/twilio/twilio.service';
import { SurveyService } from '../survey/service/survey.service';
import { CustomerService } from '../customer/service/customer.service';
import { CustomerModule } from '../customer/customer.module';
import { PrismaService } from '../client/prisma/prisma.service';
import { hookProviders } from '../config/providers/hookProviders';
import { AppLogger } from '../utils/appLogger';

@Module({
  imports: [CustomerModule],
  controllers: [HookController],
  providers: [
    HookService,
    SurveyService,
    TwilioService,
    CustomerService,
    PrismaService,
    AppLogger,
    ...hookProviders,
  ],
})
export class HookModule {}
