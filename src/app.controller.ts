import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async getMessage(
    @Body() message
  ) {
    console.log(message)
    const response = await this.appService.sendMessage(message)

    console.log(response)
    return {
      status: 'ok',
      response
    }
  }
}
