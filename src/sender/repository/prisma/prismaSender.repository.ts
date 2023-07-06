import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { SenderRepository } from '../sender.repository';
import { randomUUID } from 'crypto';
import { Sender } from '@prisma/client';
import { CreateSenderRequestDTO } from '../../../sender/dto/createSenderRequest.dto';
import { GetSenderModel } from '../../../sender/model/getSender.model';

@Injectable()
export class PrismaSenderRepository implements SenderRepository {
  constructor(private readonly prisma: PrismaService) {}

  createSender = async (
    createSenderRequest: CreateSenderRequestDTO,
  ): Promise<Sender> =>
    this.prisma.sender.create({
      data: {
        id: randomUUID(),
        ...createSenderRequest,
      },
    });

  getSender = async (senderData: GetSenderModel): Promise<Sender> =>
    this.prisma.sender.findFirst({
      where: senderData,
    });
}
