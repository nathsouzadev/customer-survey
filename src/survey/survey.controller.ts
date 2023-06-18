import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { SurveyService } from './service/survey.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AppLogger } from '../utils/appLogger';

@Controller()
export class SurveyController {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly logger: AppLogger,
  ) {}

  @ApiOkResponse({
    description: 'Return survey with results',
    schema: {
      example: {
        id: '5e0c66bb-e82d-4fef-afe8-8a27c6a6e3c5',
        companyId: '904c56d0-2223-4b0d-8f9c-d512cf7d4160',
        name: 'Exampled Survey',
        title: 'Customer Experience',
        questions: [
          {
            id: 'b6140683-b987-4260-855b-5138be0e382b',
            surveyId: '5e0c66bb-e82d-4fef-afe8-8a27c6a6e3c5',
            question: 'Como você avalia o nosso atendimento?',
            answers: [
              { label: 'bom', quantity: 3 },
              { label: 'regular', quantity: 2 },
              { label: 'ruim', quantity: 1 },
            ],
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Return error when does not have token',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':surveyId')
  getSurvey(@Request() request: any, @Param('surveyId') surveyId: string) {
    this.logger.logger(
      {
        headers: request.headers,
        message: 'Request received',
      },
      SurveyController.name,
    );
    return this.surveyService.getSurveyResults(surveyId);
  }
}
