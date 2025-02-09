import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../repository/company.repository';
import { CreateCompanyRequestDTO } from '../dto/createCompanyRequest.dto';
import { CompanyModel } from '../model/company.model';
import { compare, hash } from 'bcryptjs';
import { AppLogger } from '../../utils/appLogger';
import { PhoneCompany } from '@prisma/client';
import { PhoneCompanyRepository } from '../repository/phoneCompany.repository';
import { PhoneCompanyWithSurvey } from '../model/phoneCompany.model';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly phoneCompanyRepository: PhoneCompanyRepository,
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

  getCompanyByEmailOrId = async (email: string): Promise<CompanyModel> =>
    this.companyRepository.getCompanyByEmailOrId(email);

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

  getPhoneByCompanyId = async (companyId: string): Promise<PhoneCompany> =>
    this.phoneCompanyRepository.getPhoneByCompanyId(companyId);

  getPhoneWithSurvey = async (
    phoneNumber: string,
  ): Promise<PhoneCompanyWithSurvey> =>
    this.phoneCompanyRepository.getPhoneWithSurvey(phoneNumber);
}
