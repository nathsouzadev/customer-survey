import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './service/customer.service';
import { CustomerRepository } from './repository/customer.repository';
import { CustomerAnswerRepository } from './repository/customerAnswer.repository';
import { CustomerSurveyRepository } from './repository/customerSurvey.repository';
import { getMockRepository } from '../__mocks__/repository.mock';
import { randomUUID } from 'crypto';
import { AppLogger } from '../utils/appLogger';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CustomerController', () => {
  let controller: CustomerController;
  let mockCustomerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            createCustomer: jest.fn(),
          },
        },
        getMockRepository(CustomerRepository),
        getMockRepository(CustomerAnswerRepository),
        getMockRepository(CustomerSurveyRepository),
        AppLogger,
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    mockCustomerService = module.get<CustomerService>(CustomerService);
  });

  it('should return a customer when created', async () => {
    const mockCompanyId = randomUUID();
    const mockCreateCustomerRequest = {
      phoneNumber: '5511999992222',
      name: 'Grace Hooper',
      companyId: mockCompanyId,
    };
    const mockCreate = jest
      .spyOn(mockCustomerService, 'createCustomer')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          ...mockCreateCustomerRequest,
        }),
      );

    const customer = await controller.createCustomer(
      { headers: {} },
      mockCreateCustomerRequest,
    );
    expect(mockCreate).toHaveBeenCalledWith(mockCreateCustomerRequest);
    expect(customer).toMatchObject({
      id: expect.any(String),
      name: 'Grace Hooper',
      phoneNumber: '5511999992222',
      companyId: mockCompanyId,
    });
  });

  it('should return a error when customer alterady exists', async () => {
    const mockCompanyId = randomUUID();
    const mockCreateCustomerRequest = {
      phoneNumber: '5511999992222',
      name: 'Grace Hooper',
      companyId: mockCompanyId,
    };
    const mockCreate = jest
      .spyOn(mockCustomerService, 'createCustomer')
      .mockImplementation(() => {
        throw new Error('Customer already exists');
      });

    expect(
      controller.createCustomer({ headers: {} }, mockCreateCustomerRequest),
    ).rejects.toThrow(
      new HttpException('Customer already exists', HttpStatus.CONFLICT),
    );
    expect(mockCreate).toHaveBeenCalledWith(mockCreateCustomerRequest);
  });
});
