import { Company } from '@prisma/client';
import { CreateCompanyRequestDTO } from '../dto/createCompanyRequest.dto';
import { CompanyModel } from '../model/company.model';

export abstract class CompanyRepository {
  abstract saveCompany(
    createCompanyRequest: CreateCompanyRequestDTO,
  ): Promise<CompanyModel>;

  abstract getCompanyByEmailOrId(emailOrId: string): Promise<CompanyModel>;

  abstract getCompany(email: string): Promise<Company>;
}
