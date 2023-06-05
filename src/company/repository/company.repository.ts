import { CreateCompanyRequestDTO } from '../dto/createCompanyRequest.dto';
import { CompanyModel } from '../model/company.model';

export abstract class CompanyRepository {
  abstract saveCompany(
    createCompanyRequest: CreateCompanyRequestDTO,
  ): Promise<CompanyModel>;

  abstract getCompanyByEmail(email: string): Promise<CompanyModel>;
}
