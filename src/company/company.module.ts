import { Module } from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { CompanyController } from './company.controller';
import { PrismaService } from '../client/prisma/prisma.service';
import { companyProviders } from '../config/providers/companyProviders';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService, ...companyProviders],
})
export class CompanyModule {}
