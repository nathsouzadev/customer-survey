import { Customer } from '@prisma/client';

export abstract class CustomerRepository {
  abstract getCustomerByPhoneNumber(phoneNumber: string): Promise<Customer>;
}
