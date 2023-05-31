import { Module } from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { CompanyController } from './company.controller';
import { CompanyRepository } from './repository/company.repository';
import { PrismaCompanyRepository } from './repository/prisma/prismaCompany.repository';
import { PrismaService } from '../client/prisma/prisma.service';

@Module({
  controllers: [CompanyController],
  providers: [
    CompanyService,
    {
      provide: CompanyRepository,
      useClass: PrismaCompanyRepository,
    },
    PrismaService,
  ],
})
export class CompanyModule {}
