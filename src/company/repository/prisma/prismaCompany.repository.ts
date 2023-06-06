import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { CompanyRepository } from '../company.repository';
import { CreateCompanyRequestDTO } from '../../../company/dto/createCompanyRequest.dto';
import { randomUUID } from 'crypto';
import { CompanyModel } from '../../../company/model/company.model';
import { Company } from '@prisma/client';

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  saveCompany = async (
    createCompanyRequest: CreateCompanyRequestDTO,
  ): Promise<CompanyModel> => {
    const company = await this.prisma.company.create({
      data: {
        id: randomUUID(),
        active: true,
        ...createCompanyRequest,
      },
    });
    delete company.password;

    return company;
  };

  getCompanyByEmail = async (email: string): Promise<CompanyModel> => {
    const company = await this.prisma.company.findFirst({
      where: {
        email,
      },
      include: {
        surveys: true,
      },
    });

    company && delete company.password;

    return company;
  };

  getCompany = (email: string): Promise<Company> =>
    this.prisma.company.findFirst({
      where: {
        email,
      },
    });
}
