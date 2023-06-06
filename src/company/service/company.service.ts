import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../repository/company.repository';
import { CreateCompanyRequestDTO } from '../dto/createCompanyRequest.dto';
import { CompanyModel } from '../model/company.model';
import { compare, hash } from 'bcryptjs';
import { AppLogger } from '../../utils/appLogger';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly logger: AppLogger,
  ) {}

  createCompany = async (
    createCompanyRequest: CreateCompanyRequestDTO,
  ): Promise<CompanyModel> => {
    const password = await hash(createCompanyRequest.password, 8);

    return this.companyRepository.saveCompany({
      ...createCompanyRequest,
      password,
    });
  };

  getCompanyByEmail = async (email: string): Promise<CompanyModel> =>
    this.companyRepository.getCompanyByEmail(email);

  getAuthCompany = async (authRequest: {
    email: string;
    password: string;
  }): Promise<CompanyModel> => {
    const company = await this.companyRepository.getCompany(authRequest.email);

    const validatePassword: boolean = await compare(
      authRequest.password,
      company.password,
    );

    if (!validatePassword || !company) {
      this.logger.error(
        `Error to get authenticate user with email: ${authRequest.email}`,
      );

      return null;
    }

    company && delete company.password;

    return company;
  };
}
