import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { SurveyRepository } from '../survey.repository';
import { SurveyResultDetails } from '../../model/surveyResultDetails';
import { CreateSurveyRequestDTO } from '../../../survey/dto/createSurveyRequest.dto';
import { Survey } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class PrismaSurveyRepository implements SurveyRepository {
  constructor(private readonly prisma: PrismaService) {}

  getSurveyResultById = async (
    surveyId: string,
  ): Promise<SurveyResultDetails> =>
    this.prisma.survey.findFirst({
      where: {
        id: surveyId,
      },
      include: {
        questions: {
          include: {
            customerAnswers: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

  createSurvey = async (
    createSurveyRequest: CreateSurveyRequestDTO,
  ): Promise<Survey> =>
    this.prisma.survey.create({
      data: {
        id: randomUUID(),
        companyId: createSurveyRequest.companyId,
        name: createSurveyRequest.name,
        title: createSurveyRequest.title,
      },
    });
}
