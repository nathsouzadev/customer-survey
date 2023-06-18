import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { CustomerSurveyRepository } from '../customerSurvey.repository';
import { CustomerSurveyModel } from '../../../customer/model/customerSurvey.model';
import { CustomerRegisteredModel } from '../../../customer/model/customerRegistered.mode';

@Injectable()
export class PrismaCustomerSurveyRepository
  implements CustomerSurveyRepository
{
  constructor(private readonly prisma: PrismaService) {}

  getSurveyByCustomerId = async (
    customerId: string,
  ): Promise<CustomerSurveyModel> =>
    this.prisma.customerSurvey.findFirst({
      where: {
        customerId,
        active: true,
      },
      include: {
        survey: {
          include: {
            questions: {
              include: {
                answers: {
                  orderBy: {
                    answer: 'asc',
                  },
                },
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });

  getCustomersBySurveyId = (
    surveyId: string,
  ): Promise<CustomerRegisteredModel[]> =>
    this.prisma.customerSurvey.findMany({
      where: {
        surveyId,
        active: true,
      },
      include: {
        customer: {
          include: {
            answers: true,
          },
        },
      },
    });
}
