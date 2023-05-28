import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './repository/customer.repository';
import { randomUUID } from 'crypto';
import { CustomerAnswerRepository } from './repository/customerAnswer.repository';
import { CustomerSurveyRepository } from './repository/customerSurvey.repository';

describe('CustomerService', () => {
  let service: CustomerService;
  let mockCustomerRepository: CustomerRepository;
  let mockCustomerAnswerRepository: CustomerAnswerRepository;
  let mockCustomerSurveyRepository: CustomerSurveyRepository

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
        {
          provide: CustomerAnswerRepository,
          useValue: {
            saveAnswer: jest.fn(),
            getAnswersByCustomerId: jest.fn(),
          },
        },
        {
          provide: CustomerSurveyRepository,
          useValue: {
            getSurveyByCustomerId: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    mockCustomerRepository = module.get<CustomerRepository>(CustomerRepository);
    mockCustomerAnswerRepository = module.get<CustomerAnswerRepository>(
      CustomerAnswerRepository,
    );
    mockCustomerSurveyRepository = module.get<CustomerSurveyRepository>(
      CustomerSurveyRepository,
    );
  });

  it('should be return customer with phoneNumber', async () => {
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

  it('should save customerAnswer and return total answers of user', async () => {
    const mockPhoneNumber = '5511999991111';
    const mockCustomerId = randomUUID();
    const mockGetCustomer = jest
      .spyOn(service, 'getCustomer')
      .mockImplementation(() =>
        Promise.resolve({
          id: mockCustomerId,
          name: 'Ada Lovelace',
          phoneNumber: '5511999991111',
        }),
      );

    const mockSaveAnswer = jest
      .spyOn(mockCustomerAnswerRepository, 'saveAnswer')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          customerId: mockCustomerId,
          answer: 'bom',
        }),
      );

    const mockGetAnswers = jest
      .spyOn(mockCustomerAnswerRepository, 'getAnswersByCustomerId')
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: randomUUID(),
            customerId: mockCustomerId,
            answer: 'bom',
          },
          {
            id: randomUUID(),
            customerId: mockCustomerId,
            answer: 'bom',
          },
        ]),
      );

    const response = await service.saveCustomerAnswer({
      answer: 'bom',
      customer: '5511999991111',
    });
    expect(mockGetCustomer).toHaveBeenCalledWith(mockPhoneNumber);
    expect(mockSaveAnswer).toHaveBeenCalledWith({
      id: expect.any(String),
      customerId: mockCustomerId,
      answer: 'bom',
    });
    expect(mockGetAnswers).toHaveBeenCalledWith(mockCustomerId);
    expect(response).toMatchObject({
      answer: {
        id: expect.any(String),
        customerId: mockCustomerId,
        answer: 'bom',
      },
      totalAnswers: 2,
    });
  });

  it('should return survey with customerId', async () => {
    const mockCustomerId = randomUUID();
    const mockSurvey = {
      id: randomUUID(),
      active: true,
      customerId: mockCustomerId,
      surveyId: randomUUID()
    };
    const mockGetSurvey = jest
      .spyOn(mockCustomerSurveyRepository, 'getSurveyByCustomerId')
      .mockImplementation(() => Promise.resolve(mockSurvey));
    
    const survey = await service.getSurvey(mockCustomerId);
    expect(mockGetSurvey).toHaveBeenCalledWith(mockCustomerId);
    expect(survey).toMatchObject({
      id: expect.any(String),
      active: true,
      customerId: mockCustomerId,
      surveyId: expect.any(String),
    });
  });
});
