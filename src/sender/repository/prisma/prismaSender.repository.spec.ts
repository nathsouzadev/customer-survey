import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { PrismaSenderRepository } from './prismaSender.repository';

describe('PrismaSenderRepository', () => {
  let repository: PrismaSenderRepository;
  let mockPrismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaSenderRepository,
        {
          provide: PrismaService,
          useValue: {
            sender: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaSenderRepository>(PrismaSenderRepository);
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return sender created', async () => {
    const mockCompanyId = randomUUID();

    const mockCreate = jest
      .spyOn(mockPrismaService.sender, 'create')
      .mockResolvedValue({
        id: randomUUID(),
        name: 'Sender',
        email: 'sender@email.com',
        companyId: mockCompanyId,
      });

    const sender = await repository.createSender({
      name: 'Sender',
      email: 'sender@email.com',
      companyId: mockCompanyId,
    });
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        id: expect.any(String),
        name: 'Sender',
        email: 'sender@email.com',
        companyId: mockCompanyId,
      },
    });
    expect(sender).toMatchObject({
      id: expect.any(String),
      name: 'Sender',
      email: 'sender@email.com',
      companyId: mockCompanyId,
    });
  });

  it('should return sender with email and companyId', async () => {
    const mockCompanyId = randomUUID();

    const mockFind = jest
      .spyOn(mockPrismaService.sender, 'findFirst')
      .mockResolvedValue({
        id: randomUUID(),
        name: 'Sender',
        email: 'sender@email.com',
        companyId: mockCompanyId,
      });

    const sender = await repository.getSender({
      email: 'sender@email.com',
      companyId: mockCompanyId,
    });
    expect(mockFind).toHaveBeenCalledWith({
      where: {
        email: 'sender@email.com',
        companyId: mockCompanyId,
      },
    });
    expect(sender).toMatchObject({
      id: expect.any(String),
      name: 'Sender',
      email: 'sender@email.com',
      companyId: mockCompanyId,
    });
  });
});
