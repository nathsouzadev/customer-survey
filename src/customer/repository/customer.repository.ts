import { Customer } from '@prisma/client';
import { CreateCustomerRequestDTO } from '../dto/createCustomerRequest.dto';

export abstract class CustomerRepository {
  abstract getCustomerByPhoneNumber(phoneNumber: string): Promise<Customer>;

  abstract createCustomer(
    createCustomerRequest: CreateCustomerRequestDTO,
  ): Promise<Customer>;
}
