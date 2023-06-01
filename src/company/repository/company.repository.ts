import { Company } from '@prisma/client';
import { CreateCompanyRequestDTO } from '../dto/createCompanyRequest.dto';

export abstract class CompanyRepository {
  abstract saveCompany(
    createCompanyRequest: CreateCompanyRequestDTO,
  ): Promise<Company>;
}
