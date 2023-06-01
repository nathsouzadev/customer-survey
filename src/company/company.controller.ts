import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { CreateCompanyRequestDTO } from './dto/createCompanyRequest.dto';
import { Company } from '@prisma/client';

@Controller()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async createCompany(
    @Body(new ValidationPipe()) createCompanyRequest: CreateCompanyRequestDTO,
  ): Promise<Company> {
    return this.companyService.createCompany(createCompanyRequest);
  }

  @Get(':email')
  async getCompanyByEmail(@Param('email') email: string): Promise<Company> {
    return this.companyService.getCompanyByEmail(email);
  }
}
