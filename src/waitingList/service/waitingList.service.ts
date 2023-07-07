import { Injectable } from '@nestjs/common';
import { WaitingCompanyRepository } from '../repository/waitingCompany.repository';
import { CreateWaitingCompanyRequestDTO } from '../dto/createWaitingCompanyRequest.dto';
import { WaitingCompany } from '@prisma/client';

@Injectable()
export class WaitingListService {
  constructor(
    private readonly waitingCompanyRepository: WaitingCompanyRepository,
  ) {}

  createWaitingCompany = async (
    createWaitingCompanyRequest: CreateWaitingCompanyRequestDTO,
  ): Promise<WaitingCompany> => {
    const waitingCompany =
      await this.waitingCompanyRepository.getWaitingCompany({
        email: createWaitingCompanyRequest.email,
        phoneNumber: createWaitingCompanyRequest.phoneNumber,
      });

    if (waitingCompany) {
      throw new Error('User already in waiting list');
    }

    return this.waitingCompanyRepository.createWaitingCompany(
      createWaitingCompanyRequest,
    );
  };
}
