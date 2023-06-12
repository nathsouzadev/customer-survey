import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { PrismaCustomerRepository } from './prismaCustomer.repository';

describe('PrismaCustomerRepository', () => {
  let repository: PrismaCustomerRepository;
  let mockPrismaService: PrismaService;
  const mockPhoneNumber = '5511999991111';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCustomerRepository,
        {
          provide: PrismaService,
          useValue: {
            customer: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaCustomerRepository>(PrismaCustomerRepository);
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return customer with phoneNumber', async () => {
    const mockCompanyId = randomUUID();
    const mockFindFirst = jest
      .spyOn(mockPrismaService.customer, 'findFirst')
      .mockResolvedValue({
        id: randomUUID(),
        name: 'Ada Lovelace',
        phoneNumber: '5511999991111',
        companyId: mockCompanyId,
      });
    const user = await repository.getCustomerByPhoneNumber(mockPhoneNumber);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        phoneNumber: mockPhoneNumber,
      },
    });
    expect(user).toMatchObject({
      id: expect.any(String),
      name: 'Ada Lovelace',
      phoneNumber: mockPhoneNumber,
      companyId: mockCompanyId,
    });
  });

  it('should be create a new customer', async () => {
    const mockCompanyId = randomUUID();
    const mockCreate = jest
      .spyOn(mockPrismaService.customer, 'create')
      .mockResolvedValue({
        id: randomUUID(),
        name: 'Customer',
        phoneNumber: '5511999992224',
        companyId: mockCompanyId,
      });
    const customer = await repository.createCustomer({
      name: 'Customer',
      phoneNumber: '5511999992224',
      companyId: mockCompanyId,
    });
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        id: expect.any(String),
        name: 'Customer',
        phoneNumber: '5511999992224',
        companyId: mockCompanyId,
      },
    });
    expect(customer).toMatchObject({
      id: expect.any(String),
      name: 'Customer',
      phoneNumber: '5511999992224',
      companyId: mockCompanyId,
    });
  });
});
