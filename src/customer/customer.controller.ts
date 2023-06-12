import { Body, Controller, HttpException, HttpStatus, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CustomerService } from './service/customer.service';
import { CreateCustomerRequestDTO } from './dto/createCustomerRequest.dto';
import { AppLogger } from '../utils/appLogger';

@Controller()
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly logger: AppLogger
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
  @ApiUnauthorizedResponse({
    description: 'Return error when does not have token',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createCustomer(@Request() request: any,
  @Body(new ValidationPipe()) createCustomerRequest: CreateCustomerRequestDTO) {
    this.logger.logger({
      headers: request.headers,
      message: 'Request received'
    }, CustomerController.name)
    try {
      const customer = await this.customerService.createCustomer(createCustomerRequest)
      return customer
    } catch (error) {
      if(error.message === 'Customer already exists'){
        throw new HttpException(
          error.message, 
          HttpStatus.CONFLICT);
      }
    }
  }
}
