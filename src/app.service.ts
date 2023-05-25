import { Injectable } from '@nestjs/common';
import twilio from 'twilio';
import TwilioClient from 'twilio/lib/rest/Twilio';

@Injectable()
export class AppService {
  client: TwilioClient

  constructor(){
    this.client = twilio(
      process.env.SERVICE_TWILIO_KEY_SID,
      process.env.SERVICE_TWILIO_KEY_SECRET
    )
  }

  sendMessage = async(messageReceived) => {
    const message = await this.client.messages.create({
      from:  process.env.ADMIN_PHONE,
      to: messageReceived.From,
      body: 'Obrigada pela sua resposta!'
    })

    console.log(message)
  }
}
