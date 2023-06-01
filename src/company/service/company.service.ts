import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../repository/company.repository';
import { CreateCompanyRequestDTO } from '../dto/createCompanyRequest.dto';
import { Company } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  createCompany = async (
    createCompanyRequest: CreateCompanyRequestDTO,
  ): Promise<Company> =>
    this.companyRepository.saveCompany(createCompanyRequest);
}
