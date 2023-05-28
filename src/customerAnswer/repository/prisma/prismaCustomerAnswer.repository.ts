import { Injectable } from '@nestjs/common';
import { CustomerAnswer } from '@prisma/client';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { CustomerAnswerRepository } from '../customerAnswer.repository';

@Injectable()
export class PrismaCustomerAnswerRepository implements CustomerAnswerRepository {
  constructor(private readonly prisma: PrismaService) {}

  saveAnswer = async (customerAnswer: CustomerAnswer): Promise<CustomerAnswer> => {
    return this.prisma.customerAnswer.create({
      data: customerAnswer
    })
  };
}
