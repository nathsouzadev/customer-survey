import {
  Controller,
  Request,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SenderService } from './service/sender.service';
import { CreateSenderRequestDTO } from './dto/createSenderRequest.dto';
import { AppLogger } from '../utils/appLogger';
import { SenderCreated } from './model/senderCreatedResponse.model';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller()
export class SenderController {
  constructor(
    private readonly senderService: SenderService,
    private readonly logger: AppLogger,
  ) {}

  @ApiCreatedResponse({
    description: 'Return contact saved',
    schema: {
      example: {
        senderCreated: {
          id: '492f8f28-75f0-4bdf-ac75-f4487d2d0d39',
          name: 'New Sender',
          email: 'sender@company.com',
          companyId: '8defa50c-1187-49f9-95af-9f1c22ec94af',
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Return erro if sender already exists',
    schema: {
      example: {
        message: 'Sender already exists',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Return error when does not have token',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createSender(
    @Request() request: any,
    @Body(new ValidationPipe()) createSenderRequest: CreateSenderRequestDTO,
  ): Promise<SenderCreated> {
    this.logger.logger(
      {
        headers: request.headers,
        requestData: createSenderRequest,
        message: 'Request received',
      },
      SenderController.name,
    );
    try {
      const sender = await this.senderService.createSender(createSenderRequest);
      return {
        senderCreated: sender,
      };
    } catch (error) {
      if (error.message === 'Sender already exists') {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
    }
  }
}
