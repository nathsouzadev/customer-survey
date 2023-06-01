import { PrismaCustomerRepository } from '../../customer/repository/prisma/prismaCustomer.repository';
import { CustomerRepository } from '../../customer/repository/customer.repository';
import { CustomerAnswerRepository } from '../../customer/repository/customerAnswer.repository';
import { PrismaCustomerAnswerRepository } from '../../customer/repository/prisma/prismaCustomerAnswer.repository';
import { CustomerSurveyRepository } from '../../customer/repository/customerSurvey.repository';
import { PrismaCustomerSurveyRepository } from '../../customer/repository/prisma/prismaCustomerSurvey.repository';

export const customerProviders = [
  {
    provide: CustomerRepository,
    useClass: PrismaCustomerRepository,
  },
  {
    provide: CustomerAnswerRepository,
    useClass: PrismaCustomerAnswerRepository,
  },
  {
    provide: CustomerSurveyRepository,
    useClass: PrismaCustomerSurveyRepository,
  },
];
