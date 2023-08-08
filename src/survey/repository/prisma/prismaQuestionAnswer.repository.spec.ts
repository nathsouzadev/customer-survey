import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { PrismaQuestionAnswerRepository } from './prismaQuestionAnswer.repository';

describe('PrismaQuestionAnswerRepository', () => {
  let repository: PrismaQuestionAnswerRepository;
  let mockPrismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaQuestionAnswerRepository,
        {
          provide: PrismaService,
          useValue: {
            questionAnswer: {
              create: jest.fn(),
              findMany: jest.fn(),
              createMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaQuestionAnswerRepository>(
      PrismaQuestionAnswerRepository,
    );
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return all answer with questionId', async () => {
    const mockQuestionId = randomUUID();
    const mockFindMany = jest
      .spyOn(mockPrismaService.questionAnswer, 'findMany')
      .mockResolvedValue([
        {
          id: randomUUID(),
          questionId: mockQuestionId,
          answer: '1',
          label: 'bom',
        },
        {
          id: randomUUID(),
          questionId: mockQuestionId,
          answer: '2',
          label: 'regular',
        },
        {
          id: randomUUID(),
          questionId: mockQuestionId,
          answer: '3',
          label: 'ruim',
        },
      ]);

    const answers = await repository.getAnswersByQuestionId(mockQuestionId);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        questionId: mockQuestionId,
      },
    });
    expect(answers).toMatchObject([
      {
        id: expect.any(String),
        questionId: mockQuestionId,
        answer: '1',
        label: 'bom',
      },
      {
        id: expect.any(String),
        questionId: mockQuestionId,
        answer: '2',
        label: 'regular',
      },
      {
        id: expect.any(String),
        questionId: mockQuestionId,
        answer: '3',
        label: 'ruim',
      },
    ]);
  });
});
