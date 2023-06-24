import { Controller, Get, HttpCode, Post, Request } from '@nestjs/common';
import { MetaService } from './service/meta.service';
import axios from 'axios';

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

  @Post()
  @HttpCode(200)
  async receiveMessage(@Request() req: any) {
    console.log('msg received', req.body);
    console.log('FROM', req.body.entry[0].changes[0].value.messages[0].from);
    console.log(
      'BODY',
      req.body.entry[0].changes[0].value.messages[0].text.body,
    );
    try {
      const response = await axios({
        method: 'POST', // Required, HTTP method, a string, e.g. POST, GET
        url:
          'https://graph.facebook.com/v12.0/' +
          req.body.entry[0].changes[0].value.metadata.phone_number_id +
          '/messages',
        data: {
          messaging_product: 'whatsapp',
          to: req.body.entry[0].changes[0].value.messages[0].from,
          text: {
            body: 'Ack REPLY ',
          },
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        },
      });
      console.log(response);
      return 'ok';
    } catch (error) {
      console.error(error.message);
      return 'erro';
    }
  }
}
