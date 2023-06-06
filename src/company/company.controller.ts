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
import { AppLogger } from '../utils/appLogger';
import { CompanyModel } from './model/company.model';

@Controller()
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly logger: AppLogger,
  ) {}

  @Post()
  async createCompany(
    @Body(new ValidationPipe()) createCompanyRequest: CreateCompanyRequestDTO,
  ): Promise<CompanyModel> {
    this.logger.logger(
      {
        requestData: createCompanyRequest,
        message: 'Request received',
      },
      CompanyController.name,
    );
    return this.companyService.createCompany(createCompanyRequest);
  }

  @Get(':email')
  async getCompanyByEmail(
    @Param('email') email: string,
  ): Promise<CompanyModel> {
    return this.companyService.getCompanyByEmail(email);
  }
}
