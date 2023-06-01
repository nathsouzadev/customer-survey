import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { HookModule } from './hook/hook.module';
import { SurveyModule } from './survey/survey.module';
import { CustomerModule } from './customer/customer.module';
import { CompanyModule } from './company/company.module';
import { RouterModule } from '@nestjs/core';

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
    RouterModule.register([
      {
        path: '',
        module: HookModule,
      },
      {
        path: 'company',
        module: CompanyModule,
        children: [
          {
            path: 'survey',
            module: SurveyModule,
          },
        ],
      },
    ]),
  ],
})
export class AppModule {}
