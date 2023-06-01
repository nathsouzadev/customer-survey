import { Controller, Get, Param } from '@nestjs/common';
import { SurveyService } from './service/survey.service';

@Controller()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get(':surveyId')
  getSurvey(@Param('surveyId') surveyId: string) {
    return this.surveyService.getSurvey(surveyId);
  }
}
