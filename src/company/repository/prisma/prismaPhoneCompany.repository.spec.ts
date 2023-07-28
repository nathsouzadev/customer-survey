import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { PrismaPhoneCompanyRepository } from './prismaPhoneCompany.repository';

describe('PrismaPhoneCompanyRepository', () => {
  let repository: PrismaPhoneCompanyRepository;
  let mockPrismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaPhoneCompanyRepository,
        {
          provide: PrismaService,
          useValue: {
            phoneCompany: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaPhoneCompanyRepository>(
      PrismaPhoneCompanyRepository,
    );
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return phoneCompany with companyId', async () => {
    const mockCompanyId = randomUUID();

    const mockFind = jest
      .spyOn(mockPrismaService.phoneCompany, 'findFirst')
      .mockResolvedValue({
        id: randomUUID(),
        active: true,
        phoneNumber: '5511999995555',
        companyId: mockCompanyId,
        metaId: '1234567890',
      });

    const company = await repository.getPhoneByCompanyId(mockCompanyId);
    expect(mockFind).toHaveBeenCalledWith({
      where: {
        companyId: mockCompanyId,
      },
    });
    expect(company).toMatchObject({
      id: expect.any(String),
      active: true,
      phoneNumber: '5511999995555',
      companyId: mockCompanyId,
      metaId: '1234567890',
    });
  });
});
