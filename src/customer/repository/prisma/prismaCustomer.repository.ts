import { Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { CustomerRepository } from '../customer.repository';
import { CreateCustomerRequestDTO } from '../../../customer/dto/createCustomerRequest.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  getCustomerByPhoneNumber = async (phoneNumber: string): Promise<Customer> =>
    this.prisma.customer.findFirst({
      where: {
        phoneNumber,
      },
    });

  createCustomer = async (
    createCustomerRequest: CreateCustomerRequestDTO,
  ): Promise<Customer> =>
    this.prisma.customer.create({
      data: {
        id: randomUUID(),
        ...createCustomerRequest,
      },
    });

  getCustomersByCompanyId = async (companyId: string): Promise<Customer[]> =>
    this.prisma.customer.findMany({
      where: { companyId },
    });
}
