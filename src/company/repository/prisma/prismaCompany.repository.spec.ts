import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { PrismaCompanyRepository } from './prismaCompany.repository';

describe('PrismaCompanyRepository', () => {
  let repository: PrismaCompanyRepository;
  let mockPrismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCompanyRepository,
        {
          provide: PrismaService,
          useValue: {
            company: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaCompanyRepository>(PrismaCompanyRepository);
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return company was created', async () => {
    const mockCreateCompanyRequest = {
      name: 'Company',
      email: 'company@email.com',
    };

    const mockCreate = jest
      .spyOn(mockPrismaService.company, 'create')
      .mockResolvedValue({
        id: randomUUID(),
        active: true,
        name: 'Company',
        email: 'company@email.com',
      });

    const company = await repository.saveCompany(mockCreateCompanyRequest);
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        ...mockCreateCompanyRequest,
        id: expect.any(String),
        active: true,
      },
    });
    expect(company).toMatchObject({
      id: expect.any(String),
      active: true,
      name: 'Company',
      email: 'company@email.com',
    });
  });
});
