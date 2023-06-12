import { Module } from '@nestjs/common';
import { SurveyService } from './service/survey.service';
import { SurveyController } from './survey.controller';
import { CustomerModule } from '../customer/customer.module';
import { CustomerService } from '../customer/service/customer.service';
import { PrismaService } from '../client/prisma/prisma.service';
import { surveyProviders } from '../config/providers/surveyProviders';
import { AppLogger } from '../utils/appLogger';

@Module({
  imports: [CustomerModule],
  controllers: [SurveyController],
  providers: [
    SurveyService,
    CustomerService,
    PrismaService,
    AppLogger,
    ...surveyProviders,
  ],
})
export class SurveyModule {}
