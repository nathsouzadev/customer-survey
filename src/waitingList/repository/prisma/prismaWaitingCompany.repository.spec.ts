import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { PrismaWaitingCompanyRepository } from './prismaWaitingCompany.repository';

describe('PrismaWaitingCompanyRepository', () => {
  let repository: PrismaWaitingCompanyRepository;
  let mockPrismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaWaitingCompanyRepository,
        {
          provide: PrismaService,
          useValue: {
            waitingCompany: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaWaitingCompanyRepository>(
      PrismaWaitingCompanyRepository,
    );
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return waitingCompany created', async () => {
    const mockCreate = jest
      .spyOn(mockPrismaService.waitingCompany, 'create')
      .mockResolvedValue({
        id: randomUUID(),
        name: 'Ada Lovelace',
        email: 'ada@email.com',
        phoneNumber: '5511999991234',
        companyName: 'Company',
      });

    const sender = await repository.createWaitingCompany({
      name: 'Ada Lovelace',
      email: 'ada@email.com',
      phoneNumber: '11999991234',
      companyName: 'Company',
    });
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        id: expect.any(String),
        name: 'Ada Lovelace',
        email: 'ada@email.com',
        phoneNumber: '5511999991234',
        companyName: 'Company',
      },
    });
    expect(sender).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@email.com',
      phoneNumber: '5511999991234',
      companyName: 'Company',
    });
  });

  it('should return waitingCompany with email and companyId', async () => {
    const mockFind = jest
      .spyOn(mockPrismaService.waitingCompany, 'findFirst')
      .mockResolvedValue({
        id: randomUUID(),
        name: 'Ada Lovelace',
        email: 'ada@email.com',
        phoneNumber: '5511999991234',
        companyName: 'Company',
      });

    const sender = await repository.getWaitingCompany({
      email: 'ada@email.com',
      phoneNumber: '11999991234',
    });
    expect(mockFind).toHaveBeenCalledWith({
      where: {
        OR: [{ email: 'ada@email.com' }, { phoneNumber: '5511999991234' }],
      },
    });
    expect(sender).toMatchObject({
      id: expect.any(String),
      name: 'Ada Lovelace',
      email: 'ada@email.com',
      phoneNumber: '5511999991234',
      companyName: 'Company',
    });
  });
});
