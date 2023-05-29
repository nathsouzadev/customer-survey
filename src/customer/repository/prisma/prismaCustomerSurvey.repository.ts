import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { CustomerSurveyRepository } from '../customerSurvey.repository';
import { CustomerSurveyModel } from '../../../customer/model/customerSurvey.model';

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
                answers: true,
              },
            },
          },
        },
      },
    });
}
