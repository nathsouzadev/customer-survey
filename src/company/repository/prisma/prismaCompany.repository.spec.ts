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
              findFirst: jest.fn(),
              exclude: jest.fn(),
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
      password: 'password'
    };

    const mockCreate = jest
      .spyOn(mockPrismaService.company, 'create')
      .mockResolvedValue({
        id: randomUUID(),
        active: true,
        name: 'Company',
        email: 'company@email.com',
        password: 'password'
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

  it('should return company with survey', async () => {
    const mockCompanyId = randomUUID();
    const mockFindFirst = jest
      .spyOn<any, any>(mockPrismaService.company, 'findFirst')
      .mockResolvedValueOnce({
        id: mockCompanyId,
        active: true,
        name: 'Company',
        email: 'company@email.com',
        password: 'password',
        surveys: [
          {
            id: randomUUID(),
            companyId: mockCompanyId,
            name: 'Survey',
            title: 'Main survey',
          },
        ],
      });

    const company = await repository.getCompanyByEmail('company@email.com');
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        email: 'company@email.com',
      },
      include: {
        surveys: true,
      },
    });
    expect(company).toMatchObject({
      id: mockCompanyId,
      active: true,
      name: 'Company',
      email: 'company@email.com',
      surveys: [
        {
          id: expect.any(String),
          companyId: mockCompanyId,
          name: 'Survey',
          title: 'Main survey',
        },
      ],
    });
  });
});
