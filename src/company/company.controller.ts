import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { CreateCompanyRequestDTO } from './dto/createCompanyRequest.dto';
import { Company } from '@prisma/client';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async createCompany(
    @Body(new ValidationPipe()) createCompanyRequest: CreateCompanyRequestDTO,
  ): Promise<Company> {
    return this.companyService.createCompany(createCompanyRequest);
  }
}
