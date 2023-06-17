import {
  Body,
  Controller,
  Param,
  Post,
  ValidationPipe,
  Request,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { HookService } from './service/hook.service';
import { MessageRequest } from './dto/messageRequest.dto';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AppLogger } from '../utils/appLogger';
import { SendSurveyModel } from './models/sendSurvey.model';

@Controller()
export class HookController {
  constructor(
    private readonly hookService: HookService,
    private readonly logger: AppLogger,
  ) {}

  @ApiOkResponse({
    description: 'Webhook receive whatsapp messages from Twilio',
    schema: {
      example: {
        status: 'ok',
        response: {
          body: 'message content',
          direction: 'outbound-api',
          from: 'whatsapp:+12345678900',
          to: 'whatsapp:+5511988885555',
          dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
          status: 'queued',
          sid: 'FMsGH890912dasb',
        },
      },
    },
  })
  @Post()
  async getMessage(@Body(new ValidationPipe()) messageRequest: MessageRequest) {
    console.log(messageRequest);
    const response = await this.hookService.sendMessage(messageRequest);

    return {
      status: 'ok',
      response,
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
  ): Promise<Promise<SendSurveyModel>> {
    this.logger.logger(
      {
        headers: request.headers,
        message: 'Request received',
      },
      HookController.name,
    );
    return this.hookService.sendSurvey(surveyId);
  }
}
