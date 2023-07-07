import { WaitingCompany } from '@prisma/client';
import { CreateWaitingCompanyRequestDTO } from '../dto/createWaitingCompanyRequest.dto';
import { GetWaitingCompanyModel } from '../model/getWaitingCompany.model';

export abstract class WaitingCompanyRepository {
  abstract createWaitingCompany(
    createWaitingCompanyRequest: CreateWaitingCompanyRequestDTO,
  ): Promise<WaitingCompany>;

  abstract getWaitingCompany(
    data: GetWaitingCompanyModel,
  ): Promise<WaitingCompany>;
}
