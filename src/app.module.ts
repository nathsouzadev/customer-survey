import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { HookModule } from './hook/hook.module';
import { SurveyModule } from './survey/survey.module';
import { CustomerModule } from './customer/customer.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(5000),
      }),
    }),
    HookModule,
    SurveyModule,
    CustomerModule,
    CompanyModule,
  ],
})
export class AppModule {}
