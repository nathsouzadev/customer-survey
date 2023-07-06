import { Sender } from '@prisma/client';
import { CreateSenderRequestDTO } from '../dto/createSenderRequest.dto';

export abstract class SenderRepository {
  abstract createSender(
    createSenderRequest: CreateSenderRequestDTO,
  ): Promise<Sender>;
}
