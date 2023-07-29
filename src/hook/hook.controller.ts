import {
  Body,
  Controller,
  Param,
  Post,
  ValidationPipe,
  Request,
  UseGuards,
  HttpCode,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { HookService } from './service/hook.service';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AppLogger } from '../utils/appLogger';
import { SendSurveyModel } from './models/sendSurvey.model';
import { ReceivedMessageRequestDTO } from './dto/receivedMessageRequest.dto';
import { SendSurveyRequestDTO } from './dto/sendSurveyRequest.dto';
import { MessageReceived } from './models/messageData.model';

@Controller()
export class HookController {
  constructor(
    private readonly hookService: HookService,
    private readonly logger: AppLogger,
  ) {}

  @ApiOkResponse({
    description: 'Webhook receive whatsapp messages from Whatsapp API',
    schema: {
      example: {
        status: 'ok',
        response: {
          messageId:
            'amid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjdFRkNERTk5NjQ5OUJCMDk0MAA=',
        },
      },
    },
  })
  @Post()
  @HttpCode(200)
  async getMessage(
    @Body(new ValidationPipe()) messageRequest: ReceivedMessageRequestDTO,
  ) {
    this.logger.logger(
      {
        requestData: messageRequest,
        message: 'Request received',
      },
      HookController.name,
    );

    if (
      (Object.keys(messageRequest.entry[0].changes[0].value).includes(
        'messages',
      ) &&
        messageRequest.entry[0].changes[0].value['messages'][0].type ===
          'text') ||
      messageRequest.entry[0].changes[0].value['messages'][0].type === 'button'
    ) {
      if (
        messageRequest.entry[0].changes[0].value['messages'][0].type ===
          'text' &&
        messageRequest.entry[0].changes[0].value['messages'][0].text.body ===
          'Responder pesquisa'
      ) {
        const response = await this.hookService.registerCustomerToSurvey(
          messageRequest.entry[0].changes[0].value as MessageReceived,
        );
        return {
          status: 'ok',
          response,
        };
      }

      const response = await this.hookService.sendMessage(
        messageRequest.entry[0].changes[0].value as MessageReceived,
      );
      return {
        status: 'ok',
        response,
      };
    }

    return {
      status: 'ok',
    };
  }

  @ApiOkResponse({
    description: 'Return surveySent with details',
    schema: {
      example: {
        surveySent: {
          surveyId: '29551fe2-3059-44d9-ab1a-f5318368b88f',
          status: 'sent',
          totalCustomers: 3,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Return error when does not have token',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('/company/survey/:surveyId')
  @HttpCode(200)
  async sendSurvey(
    @Request() request: any,
    @Param('surveyId') surveyId: string,
    @Body(new ValidationPipe()) sendSurveyRequest: SendSurveyRequestDTO,
  ): Promise<Promise<SendSurveyModel>> {
    this.logger.logger(
      {
        headers: request.headers,
        message: 'Request received',
      },
      HookController.name,
    );
    return this.hookService.sendSurvey({
      surveyId,
      ...sendSurveyRequest,
    });
  }

  @Get()
  async activate(@Request() req: any) {
    if (req.query['hub.verify_token'] == process.env.WEBHOOK_TOKEN) {
      return req.query['hub.challenge'];
    }
    throw new UnauthorizedException();
  }
}
