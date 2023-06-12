import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { CreateCompanyRequestDTO } from './dto/createCompanyRequest.dto';
import { AppLogger } from '../utils/appLogger';
import { CompanyModel } from './model/company.model';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller()
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly logger: AppLogger,
  ) {}

  @ApiCreatedResponse({
    description: 'Create new company',
    schema: {
      example: {
        id: '904c56d0-2223-4b0d-8f9c-d512cf7d4160',
        name: 'Company',
        active: true,
        email: 'company@email.com',
      },
    },
  })
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

  @ApiOkResponse({
    description: 'Return company with email',
    schema: {
      example: {
        id: '904c56d0-2223-4b0d-8f9c-d512cf7d4160',
        name: 'Company',
        active: true,
        email: 'company@email.com',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Return error when does not have token',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':email')
  async getCompanyByEmail(
    @Param('email') email: string,
  ): Promise<CompanyModel> {
    return this.companyService.getCompanyByEmail(email);
  }
}
