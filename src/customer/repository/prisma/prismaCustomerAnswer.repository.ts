import { Injectable } from '@nestjs/common';
import { CustomerAnswer } from '@prisma/client';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { CustomerAnswerRepository } from '../customerAnswer.repository';
import { CustomerAnswersRequestModel } from '../../../customer/model/customerAnswerRequest.model';

@Injectable()
export class PrismaCustomerAnswerRepository
  implements CustomerAnswerRepository
{
  constructor(private readonly prisma: PrismaService) {}

  saveAnswer = async (
    customerAnswer: CustomerAnswer,
  ): Promise<CustomerAnswer> =>
    this.prisma.customerAnswer.create({
      data: customerAnswer,
    });

  getAnswersByCustomerId = async (
    customerId: string,
  ): Promise<CustomerAnswer[]> =>
    this.prisma.customerAnswer.findMany({
      where: {
        customerId,
      },
    });

  getCustomerAnswersToSurvey = async (
    customerAnswersRequest: CustomerAnswersRequestModel,
  ): Promise<CustomerAnswer[]> =>
    this.prisma.customerAnswer.findMany({
      where: {
        customerId: customerAnswersRequest.customerId,
        questionId: { in: customerAnswersRequest.questionsId },
      },
    });
}
