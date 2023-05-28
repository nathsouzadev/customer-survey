import { Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { CustomerRepository } from '../customer.repository';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  getCustomerByPhoneNumber = async (phoneNumber: string): Promise<Customer> => {
    return this.prisma.customer.findFirst(({
      where: {
        phoneNumber
      }
    }))
  };
}
