import { Sender } from '@prisma/client';
import { CreateSenderRequestDTO } from '../dto/createSenderRequest.dto';
import { GetSenderModel } from '../model/getSender.model';

export abstract class SenderRepository {
  abstract createSender(
    createSenderRequest: CreateSenderRequestDTO,
  ): Promise<Sender>;

  abstract getSender(senderData: GetSenderModel): Promise<Sender>;
}
