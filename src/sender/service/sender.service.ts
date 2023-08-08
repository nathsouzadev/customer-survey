import { Injectable } from '@nestjs/common';
import { Sender } from '@prisma/client';
import { CreateSenderRequestDTO } from '../dto/createSenderRequest.dto';
import { SenderRepository } from '../repository/sender.repository';
import { GetSenderModel } from '../model/getSender.model';

@Injectable()
export class SenderService {
  constructor(private readonly senderReqpository: SenderRepository) {}
  createSender = async (
    createSenderRequest: CreateSenderRequestDTO,
  ): Promise<Sender> => {
    const sender = await this.validateSender({
      email: createSenderRequest.email,
      companyId: createSenderRequest.companyId,
    });

    if (sender) {
      throw new Error(`Sender already exists`);
    }

    return this.senderReqpository.createSender(createSenderRequest);
  };

  validateSender = async (senderData: GetSenderModel): Promise<Sender> =>
    this.senderReqpository.getSender({
      email: senderData.email,
      companyId: senderData.companyId,
    });
}
