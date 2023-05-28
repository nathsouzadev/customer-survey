import { Injectable } from '@nestjs/common';
import { CustomerRepository } from './repository/customer.repository';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository){}

  getCustomer = async(phoneNumber: string): Promise<Customer> => this.customerRepository.getCustomerByPhoneNumber(phoneNumber)
}
