import { Module } from '@nestjs/common';
import { HookController } from './hook.controller';
import { HookService } from './service/hook.service';
import { SurveyService } from '../survey/service/survey.service';
import { CustomerService } from '../customer/service/customer.service';
import { CustomerModule } from '../customer/customer.module';
import { PrismaService } from '../client/prisma/prisma.service';
import { hookProviders } from '../config/providers/hookProviders';
import { AppLogger } from '../utils/appLogger';
import { WBService } from '../client/wb/wb.service';
import { CompanyService } from '../company/service/company.service';

@Module({
  imports: [CustomerModule],
  controllers: [HookController],
  providers: [
    HookService,
    SurveyService,
    WBService,
    CustomerService,
    CompanyService,
    PrismaService,
    AppLogger,
    ...hookProviders,
  ],
})
export class HookModule {}
