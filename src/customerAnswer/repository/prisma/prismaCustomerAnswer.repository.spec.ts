import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { PrismaCustomerAnswerRepository } from './prismaCustomerAnswer.repository';

describe('PrismaCustomerAnswerRepository', () => {
  let repository: PrismaCustomerAnswerRepository;
  let mockPrismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCustomerAnswerRepository,
        {
          provide: PrismaService,
          useValue: {
            customerAnswer: {
              create: jest.fn(),
              findMany: jest.fn()
            }
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaCustomerAnswerRepository>(PrismaCustomerAnswerRepository);
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return answer saved on database', async () => {
    const mockCustomerId = randomUUID()
    const mockAnswer = {
      id: randomUUID(),
      customerId: mockCustomerId,
      answer: 'bom'
    }
    const mockSave = jest.spyOn(mockPrismaService.customerAnswer, 'create').mockResolvedValue(mockAnswer)
    const user = await repository.saveAnswer(mockAnswer);
    expect(mockSave).toHaveBeenCalledWith({
      data: mockAnswer
    });
    expect(user).toMatchObject({
      id: expect.any(String),
      customerId: mockCustomerId,
      answer: 'bom'
    });
  });

  it('should return all answer with customerId', async() => {
    const mockCustomerId = randomUUID()
    const mockFindMany = jest.spyOn(mockPrismaService.customerAnswer, 'findMany').mockResolvedValue([
      {
        id: randomUUID(),
        customerId: mockCustomerId,
        answer: 'bom'
      },
      {
        id: randomUUID(),
        customerId: mockCustomerId,
        answer: 'bom'
      },
    ])

    const answers = await repository.getAnswersByCustomerId(mockCustomerId)
    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        customerId: mockCustomerId
      }
    })
    expect(answers).toMatchObject([
      {
        id: expect.any(String),
        customerId: mockCustomerId,
        answer: 'bom'
      },
      {
        id: expect.any(String),
        customerId: mockCustomerId,
        answer: 'bom'
      },
    ])
  })
});
