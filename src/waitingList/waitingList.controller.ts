import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { WaitingListService } from './service/waitingList.service';
import { AppLogger } from '../utils/appLogger';
import { WaitingCompanyCreatedModel } from './model/waitingCompanyCreated.model';
import { CreateWaitingCompanyRequestDTO } from './dto/createWaitingCompanyRequest.dto';
import { ApiConflictResponse, ApiCreatedResponse } from '@nestjs/swagger';

@Controller()
export class WaitingListController {
  constructor(
    private readonly waitingListService: WaitingListService,
    private readonly logger: AppLogger,
  ) {}

  @ApiCreatedResponse({
    description: 'Return contact saved',
    schema: {
      example: {
        waitingCompanyCreated: {
          id: '492f8f28-75f0-4bdf-ac75-f4487d2d0d39',
          name: 'Ada Lovelace',
          email: 'ada@email.com',
          phoneNumber: '5511999991234',
          companyName: 'Company',
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Return error if user already in waiting list',
    schema: {
      example: {
        message: 'User already in waiting list',
      },
    },
  })
  @Post()
  async createWaitingCompany(
    @Request() request: any,
    @Body(new ValidationPipe())
    createWaitingCompanyRequest: CreateWaitingCompanyRequestDTO,
  ): Promise<WaitingCompanyCreatedModel> {
    this.logger.logger(
      {
        headers: request.headers,
        requestData: createWaitingCompanyRequest,
        message: 'Request received',
      },
      WaitingListController.name,
    );

    try {
      const waitingCompany = await this.waitingListService.createWaitingCompany(
        createWaitingCompanyRequest,
      );
      return {
        waitingCompanyCreated: waitingCompany,
      };
    } catch (error) {
      if (error.message === 'User already in waiting list') {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
    }
  }
}
