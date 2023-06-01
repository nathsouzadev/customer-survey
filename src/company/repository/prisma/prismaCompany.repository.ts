import { Injectable } from '@nestjs/common';
import { Company } from '@prisma/client';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { CompanyRepository } from '../company.repository';
import { CreateCompanyRequestDTO } from '../../../company/dto/createCompanyRequest.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  saveCompany = async (
    createCompanyRequest: CreateCompanyRequestDTO,
  ): Promise<Company> =>
    this.prisma.company.create({
      data: {
        id: randomUUID(),
        active: true,
        ...createCompanyRequest,
      },
    });

  getCompanyByEmail = async (email: string): Promise<Company> =>
    this.prisma.company.findFirst({
      where: {
        email,
      },
      include: {
        surveys: true,
      },
    });
}
