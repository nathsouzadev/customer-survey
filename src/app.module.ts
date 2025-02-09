import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { HookModule } from './hook/hook.module';
import { SurveyModule } from './survey/survey.module';
import { CustomerModule } from './customer/customer.module';
import { CompanyModule } from './company/company.module';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { SenderModule } from './sender/sender.module';
import { WaitingListModule } from './waitingList/waitingList.module';
import { router } from './config/router';

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
    AuthModule,
    RouterModule.register(router),
    SenderModule,
    WaitingListModule,
  ],
})
export class AppModule {}
