import { Controller, Get, Post, Request } from '@nestjs/common';
import { MetaService } from './service/meta.service';
import axios from 'axios'

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
  receiveMessage(@Request() req: any) {
    console.log('msg received', req.body);
    axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        "https://graph.facebook.com/v12.0/" +
        req.body.entry[0].changes[0].value.metadata.phone_number_id +
        "/messages?access_token=" +
        process.env.WHATSAPP_TOKEN,
      data: {
        messaging_product: "whatsapp",
        to: req.body.entry[0].changes[0].value.messages[0].from,
        text: { body: "Ack: " + req.body.entry[0].changes[0].value.messages[0].text.body },
      },
      headers: { "Content-Type": "application/json" },
    });
  }
}
