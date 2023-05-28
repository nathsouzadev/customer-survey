import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../client/prisma/prisma.service';
import { PrismaCustomerSurveyRepository } from './prismaCustomerSurvey.repository';

describe('PrismaCustomerSurveyRepository', () => {
  let repository: PrismaCustomerSurveyRepository;
  let mockPrismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCustomerSurveyRepository,
        {
          provide: PrismaService,
          useValue: {
            customerSurvey: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaCustomerSurveyRepository>(
      PrismaCustomerSurveyRepository,
    );
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return survey with customerId', async () => {
    const mockCustomerId = randomUUID();
    const mockSurvey = {
      id: randomUUID(),
      active: true,
      customerId: mockCustomerId,
      surveyId: randomUUID()
    };
    const mockSave = jest
      .spyOn(mockPrismaService.customerSurvey, 'findFirst')
      .mockResolvedValue(mockSurvey);
    const user = await repository.getSurveyByCustomerId(mockCustomerId);
    expect(mockSave).toHaveBeenCalledWith({
      where: {
        customerId: mockCustomerId
      }
    });
    expect(user).toMatchObject({
      id: expect.any(String),
      active: true,
      customerId: mockCustomerId,
      surveyId: expect.any(String),
    });
  });
});
