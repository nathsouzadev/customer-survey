import { Test, TestingModule } from '@nestjs/testing';
import { SenderService } from './sender.service';
import { randomUUID } from 'crypto';
import { SenderRepository } from '../repository/sender.repository';

describe('SenderService', () => {
  let service: SenderService;
  let mockSenderRepository: SenderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SenderService,
        {
          provide: SenderRepository,
          useValue: {
            createSender: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SenderService>(SenderService);
    mockSenderRepository = module.get<SenderRepository>(SenderRepository);
  });

  it('should return sender created', async () => {
    const mockCompanyId = randomUUID();
    const mockCreate = jest
      .spyOn(mockSenderRepository, 'createSender')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          name: 'New Sender',
          email: 'sender@company.com',
          companyId: mockCompanyId,
        }),
      );

    const sender = await service.createSender({
      name: 'New Sender',
      email: 'sender@company.com',
      companyId: mockCompanyId,
    });
    expect(mockCreate).toHaveBeenCalledWith({
      name: 'New Sender',
      email: 'sender@company.com',
      companyId: mockCompanyId,
    });
    expect(sender).toMatchObject({
      id: expect.any(String),
    });
  });
});
