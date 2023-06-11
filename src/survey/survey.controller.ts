import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SurveyService } from './service/survey.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':surveyId')
  getSurvey(@Param('surveyId') surveyId: string) {
    return this.surveyService.getSurvey(surveyId);
  }
}
