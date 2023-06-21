import { Controller, Get, Request } from '@nestjs/common';
import { MetaService } from './service/meta.service';

@Controller('meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Get()
  findAll(@Request() req: any) {
    console.log(req.query);
    const challenge = req.query['hub.challenge'];
    if (req.query['hub.verify_token'] == 'MESSAGE-SERVICE') {
      console.log('validate');
      return challenge;
    }
  }
}
