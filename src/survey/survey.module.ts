import { Module } from '@nestjs/common';
import { SurveyService } from './service/survey.service';
import { SurveyController } from './survey.controller';
import { CustomerModule } from '../customer/customer.module';
import { CustomerService } from '../customer/customer.service';
import { PrismaService } from '../client/prisma/prisma.service';
import { surveyProviders } from '../config/providers/surveyProviders';

@Module({
  imports: [CustomerModule],
  controllers: [SurveyController],
  providers: [
    SurveyService,
    CustomerService,
    PrismaService,
    ...surveyProviders,
  ],
})
export class SurveyModule {}
