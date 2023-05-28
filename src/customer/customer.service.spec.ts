import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './repository/customer.repository';
import { randomUUID } from 'crypto';

describe('CustomerService', () => {
  let service: CustomerService;
  let mockCustomerRepository: CustomerRepository;

  const mockPhoneNumber = '5511999991111';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: CustomerRepository,
          useValue: {
            getCustomerByPhoneNumber: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    mockCustomerRepository = module.get<CustomerRepository>(CustomerRepository);
  });

  it('shoulde be return customer with phoneNumber', async () => {
    const mockGetCustomer = jest
      .spyOn(mockCustomerRepository, 'getCustomerByPhoneNumber')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          name: 'Ada Lovelace',
          phoneNumber: '5511999991111',
        }),
      );

    const customer = await service.getCustomer(mockPhoneNumber);
    expect(mockGetCustomer).toHaveBeenCalledWith(mockPhoneNumber);
    expect(customer).toMatchObject({
      id: expect.any(String),
      name: 'Ada Lovelace',
      phoneNumber: mockPhoneNumber,
    });
  });
});
