import { Module } from '@nestjs/common';
import { HookController } from './hook.controller';
import { HookService } from './service/hook.service';
import { TwilioService } from '../client/twilio.service';
import { AnswerService } from '../answer/service/answer.service';

@Module({
  controllers: [HookController],
  providers: [HookService, AnswerService, TwilioService]
})
export class HookModule {}
