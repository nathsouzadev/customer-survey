import { Controller, Get } from '@nestjs/common';
import { SurveyService } from './service/survey.service';

@Controller()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  getSurvey() {
    return this.surveyService.getSurvey();
  }
}
