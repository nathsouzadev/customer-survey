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
      password: 'password',
    };

    const mockCreate = jest
      .spyOn(mockPrismaService.company, 'create')
      .mockResolvedValue({
        id: randomUUID(),
        active: true,
        name: 'Company',
        email: 'company@email.com',
        password: 'password',
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

  it('should return company with email', async () => {
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
        phoneNumbers: [
          {
            id: randomUUID(),
            companyId: mockCompanyId,
            active: true,
            phoneNumber: '5511999991234',
            metaId: '1234567890',
          },
        ],
      });

    const company = await repository.getCompanyByEmailOrId('company@email.com');
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        OR: [{ id: 'company@email.com' }, { email: 'company@email.com' }],
      },
      select: {
        id: true,
        active: true,
        name: true,
        email: true,
        password: false,
        surveys: true,
        phoneNumbers: true,
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
      phoneNumbers: [
        {
          id: expect.any(String),
          companyId: mockCompanyId,
          active: true,
          phoneNumber: '5511999991234',
          metaId: '1234567890',
        },
      ],
    });
  });

  it('should return company with email', async () => {
    const mockFindFirst = jest
      .spyOn(mockPrismaService.company, 'findFirst')
      .mockResolvedValue({
        id: randomUUID(),
        active: true,
        name: 'Company',
        email: 'company@email.com',
        password: 'password',
      });

    const company = await repository.getCompany('company@email.com');
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        email: 'company@email.com',
      },
    });
    expect(company).toMatchObject({
      id: expect.any(String),
      active: true,
      name: 'Company',
      email: 'company@email.com',
      password: 'password',
    });
  });
});
