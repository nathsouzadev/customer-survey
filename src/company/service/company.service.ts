import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../repository/company.repository';
import { CreateCompanyRequestDTO } from '../dto/createCompanyRequest.dto';
import { CompanyModel } from '../model/company.model';
import { hash } from 'bcryptjs'

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  createCompany = async (
    createCompanyRequest: CreateCompanyRequestDTO,
  ): Promise<CompanyModel> => {
    const password = await hash(createCompanyRequest.password, 8)

    return this.companyRepository.saveCompany({
      ...createCompanyRequest,
      password
    });
  }

  getCompanyByEmail = async (email: string): Promise<CompanyModel> =>
    this.companyRepository.getCompanyByEmail(email);
}
