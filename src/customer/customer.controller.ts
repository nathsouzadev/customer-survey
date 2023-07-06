import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CustomerService } from './service/customer.service';
import { CreateCustomerRequestDTO } from './dto/createCustomerRequest.dto';
import { AppLogger } from '../utils/appLogger';

@Controller()
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly logger: AppLogger,
  ) {}

  @ApiCreatedResponse({
    description: 'Return contact saved',
    schema: {
      example: {
        id: '492f8f28-75f0-4bdf-ac75-f4487d2d0d39',
        phoneNumber: '5511999992222',
        name: 'Grace Hooper',
        companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Return erro if customer already exists',
    schema: {
      example: {
        message: 'Customer already exists',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Return error when does not have token',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createCustomer(
    @Request() request: any,
    @Body(new ValidationPipe()) createCustomerRequest: CreateCustomerRequestDTO,
  ) {
    this.logger.logger(
      {
        headers: request.headers,
        message: 'Request received',
      },
      CustomerController.name,
    );
    try {
      const customer = await this.customerService.createCustomer(
        createCustomerRequest,
      );
      return customer;
    } catch (error) {
      if (error.message === 'Customer already exists') {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
    }
  }

  @ApiOkResponse({
    description: 'Return customers with companyId',
    schema: {
      example: {
        customers: [
          {
            id: '492f8f28-75f0-4bdf-ac75-f4487d2d0d39',
            name: 'Grace Hooper',
            phoneNumber: '5511999992222',
            companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
          },
          {
            id: 'e1347b38-dfcd-42a3-894c-42ccfc35a54f',
            name: 'Katherine Johnson',
            phoneNumber: '5511999992221',
            companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Return error when does not have token',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':companyId')
  async getCustomers(
    @Request() request: any,
    @Param('companyId') companyId: string,
  ) {
    this.logger.logger(
      {
        headers: request.headers,
        message: 'Request received',
      },
      CustomerController.name,
    );

    const customers = await this.customerService.getCustomersByCompanyId(
      companyId,
    );

    return { customers };
  }
}
