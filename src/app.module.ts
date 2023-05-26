import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwilioService } from './client/twilio.service';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
      PORT: Joi.number().default(5000)
      })
    }), ],
  controllers: [AppController],
  providers: [AppService, TwilioService],
})
export class AppModule {}
