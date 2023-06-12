import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { HookService } from './service/hook.service';
import { MessageRequest } from './dto/messageRequest.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class HookController {
  constructor(private readonly hookService: HookService) {}

  @ApiOkResponse({
    description: 'Webhook receive whatsapp messages from Twilio',
    schema: {
      example: {
        status: 'ok',
        response: {
          body: 'message content',
          direction: 'outbound-api',
          from: 'whatsapp:+12345678900',
          to: 'whatsapp:+5511988885555',
          dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
          status: 'queued',
          sid: 'FMsGH890912dasb',
        },
      },
    },
  })
  @Post()
  async getMessage(@Body(new ValidationPipe()) messageRequest: MessageRequest) {
    console.log(messageRequest);
    const response = await this.hookService.sendMessage(messageRequest);

    return {
      status: 'ok',
      response,
    };
  }
}
