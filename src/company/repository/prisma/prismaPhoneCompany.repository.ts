import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { PhoneCompany } from '@prisma/client';
import { PhoneCompanyRepository } from '../phoneCompany.repository';

@Injectable()
export class PrismaPhoneCompanyRepository implements PhoneCompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  getPhoneByCompanyId = (companyId: string): Promise<PhoneCompany> =>
    this.prisma.phoneCompany.findFirst({
      where: {
        companyId,
      },
    });
}
