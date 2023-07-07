import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { WaitingCompanyRepository } from '../waitingCompany.repository';
import { randomUUID } from 'crypto';
import { WaitingCompany } from '@prisma/client';
import { GetWaitingCompanyModel } from '../../../waitingList/model/getWaitingCompany.model';
import { CreateWaitingCompanyRequestDTO } from '../../../waitingList/dto/createWaitingCompanyRequest.dto';

@Injectable()
export class PrismaWaitingCompanyRepository
  implements WaitingCompanyRepository
{
  constructor(private readonly prisma: PrismaService) {}

  createWaitingCompany = async (
    createWaitingCompanyRequest: CreateWaitingCompanyRequestDTO,
  ): Promise<WaitingCompany> =>
    this.prisma.waitingCompany.create({
      data: {
        ...createWaitingCompanyRequest,
        id: randomUUID(),
        phoneNumber: `55${createWaitingCompanyRequest.phoneNumber}`,
      },
    });

  getWaitingCompany = async (
    data: GetWaitingCompanyModel,
  ): Promise<WaitingCompany> =>
    this.prisma.waitingCompany.findFirst({
      where: {
        OR: [
          { email: data.email },
          {
            phoneNumber: `55${data.phoneNumber}`,
          },
        ],
      },
    });
}
