import { Injectable } from '@nestjs/common';
import { Sender } from '@prisma/client';
import { CreateSenderRequestDTO } from '../dto/createSenderRequest.dto';
import { SenderRepository } from '../repository/sender.repository';

@Injectable()
export class SenderService {
  constructor(private readonly senderReqpository: SenderRepository) {}
  createSender = async (
    createSenderRequest: CreateSenderRequestDTO,
  ): Promise<Sender> => {
    const sender = await this.senderReqpository.getSender({
      email: createSenderRequest.email,
      companyId: createSenderRequest.companyId,
    });

    if (sender) {
      throw new Error(`Sender already exists`);
    }

    return this.senderReqpository.createSender(createSenderRequest);
  };
}
