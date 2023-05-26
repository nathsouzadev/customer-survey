import { Module } from '@nestjs/common';
import { SurveyService } from './service/survey.service';
import { SurveyController } from './survey.controller';

@Module({
  controllers: [SurveyController],
  providers: [SurveyService]
})
export class SurveyModule {}
