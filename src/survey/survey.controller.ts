import { Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { SurveyService } from './service/survey.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

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
  getSurvey(@Param('surveyId') surveyId: string) {
    return this.surveyService.getSurvey(surveyId);
  }

  @ApiOkResponse({
    description: 'Return surveySent with details',
    schema: {
      example: {
        surveySent: {
          surveyId: '29551fe2-3059-44d9-ab1a-f5318368b88f',
          status: 'sent',
          totalCustomers: 3
        }
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Return error when does not have token',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post(':surveyId')
  @HttpCode(200)
  sendSurvey(@Param('surveyId') surveyId: string) {
    return {
      surveySent: {
        surveyId,
        status: 'sent',
        totalCustomers: 3
      }
    }
  }
}
