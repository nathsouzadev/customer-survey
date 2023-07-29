import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { PhoneCompany } from '@prisma/client';
import { PhoneCompanyRepository } from '../phoneCompany.repository';
import { PhoneCompanyWithSurvey } from '../../../company/model/phoneCompany.model';

@Injectable()
export class PrismaPhoneCompanyRepository implements PhoneCompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  getPhoneByCompanyId = async (companyId: string): Promise<PhoneCompany> =>
    this.prisma.phoneCompany.findFirst({
      where: {
        companyId,
      },
    });

  getPhoneWithSurvey = async (
    phoneNumber: string,
  ): Promise<PhoneCompanyWithSurvey> =>
    this.prisma.phoneCompany.findFirst({
      where: {
        phoneNumber,
      },
      include: {
        company: {
          include: {
            surveys: true,
          },
        },
      },
    });
}
