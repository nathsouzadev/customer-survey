import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { HookService } from './service/hook.service';
import { MessageRequest } from './dto/messageRequest.dto';

@Controller()
export class HookController {
  constructor(private readonly hookService: HookService) {}

  @Post()
  async getMessage(
    @Body(new ValidationPipe()) messageRequest: MessageRequest,
  ) {
    console.log(messageRequest)
    const response = await this.hookService.sendMessage(messageRequest)

    console.log(response)
    return {
      status: 'ok',
      response
    }
  }
}
