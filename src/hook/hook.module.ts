import { Module } from '@nestjs/common';
import { HookController } from './hook.controller';
import { HookService } from './service/hook.service';
import { TwilioService } from '../client/twilio/twilio.service';
import { SurveyService } from '../survey/service/survey.service';

@Module({
  controllers: [HookController],
  providers: [HookService, SurveyService, TwilioService],
})
export class HookModule {}
