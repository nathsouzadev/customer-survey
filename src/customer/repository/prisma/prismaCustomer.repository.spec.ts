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
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaCustomerRepository>(PrismaCustomerRepository);
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return customer with phoneNumber', async () => {
    const mockFindFirst = jest
      .spyOn(mockPrismaService.customer, 'findFirst')
      .mockResolvedValue({
        id: randomUUID(),
        name: 'Ada Lovelace',
        phoneNumber: '5511999991111',
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
    });
  });
});
