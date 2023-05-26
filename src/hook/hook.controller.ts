import { Body, Controller, Post } from '@nestjs/common';
import { HookService } from './service/hook.service';

@Controller()
export class HookController {
  constructor(private readonly hookService: HookService) {}

  @Post()
  async getMessage(
    @Body() message
  ) {
    console.log(message)
    const response = await this.hookService.sendMessage(message)

    console.log(response)
    return {
      status: 'ok',
      response
    }
  }
}
