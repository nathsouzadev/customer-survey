import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAnswerService } from './customerAnswer.service';
import { CustomerService } from '../customer/customer.service';
import { randomUUID } from 'crypto';
import { CustomerAnswerRepository } from './repository/customerAnswer.repository';

describe('CustomerAnswerService', () => {
  let service: CustomerAnswerService;
  let mockCustomerService: CustomerService
  let mockCustomerAnswerRepository: CustomerAnswerRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerAnswerService,
        {
          provide: CustomerService,
          useValue: {
            getCustomer: jest.fn()
          }
        },
        {
          provide: CustomerAnswerRepository,
          useValue: {
            saveAnswer: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<CustomerAnswerService>(CustomerAnswerService);
    mockCustomerService = module.get<CustomerService>(CustomerService);
    mockCustomerAnswerRepository = module.get<CustomerAnswerRepository>(CustomerAnswerRepository)
  });

  it('should save customerAnswer and return total answers of user', async() => {
    const mockPhoneNumber = '5511999991111'
    const mockCustomerId = randomUUID()
    const mockGetCustomer = jest.spyOn(mockCustomerService, 'getCustomer').mockImplementation(() => Promise.resolve({
      id: mockCustomerId,
      name: 'Ada Lovelace',
      phoneNumber: '5511999991111',
    }))

    const mockSaveAnswer = jest.spyOn(mockCustomerAnswerRepository, 'saveAnswer').mockImplementation(() => Promise.resolve({
      id: randomUUID(),
      customerId: mockCustomerId,
      answer: 'bom'
    }))

    const response = await service.saveCustomerAnswer({
      answer: 'bom',
      customer: '5511999991111'
    })
    expect(mockGetCustomer).toHaveBeenCalledWith(mockPhoneNumber)
    expect(mockSaveAnswer).toHaveBeenCalledWith({
      id: expect.any(String),
      customerId: mockCustomerId,
      answer: 'bom'
    })
    expect(response).toMatchObject({
      answer: {
        id: expect.any(String),
        customerId: mockCustomerId,
        answer: 'bom'
      },
      totalAnswers: 1
    })
  });
});
