import { Injectable } from '@nestjs/common';
import { CustomerSurvey } from '@prisma/client';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { CustomerSurveyRepository } from '../customerSurvey.repository';

@Injectable()
export class PrismaCustomerSurveyRepository
  implements CustomerSurveyRepository
{
  constructor(private readonly prisma: PrismaService) {}

  getSurveyByCustomerId = async (
    customerId: string,
  ): Promise<CustomerSurvey> =>
    this.prisma.customerSurvey.findFirst({
      where: {
        customerId,
      },
    });
}
