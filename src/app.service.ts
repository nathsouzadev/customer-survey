import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class AppService {
  constructor(
    private readonly client: Twilio = new Twilio(
      process.env.SERVICE_TWILIO_KEY_SID,
      process.env.SERVICE_TWILIO_KEY_SECRET
    )
  ){}

  sendMessage = async(messageReceived) => {
    const message = await this.client.messages.create({
      from:  process.env.ADMIN_PHONE,
      to: messageReceived.from,
      body: 'Obrigada pela sua resposta!'
    })

    console.log(message)
  }
}
