import { Module } from '@nestjs/common';
import { HookController } from './hook.controller';
import { HookService } from './service/hook.service';
import { TwilioService } from '../client/twilio.service';

@Module({
  controllers: [HookController],
  providers: [HookService, TwilioService]
})
export class HookModule {}
