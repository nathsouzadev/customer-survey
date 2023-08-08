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
            getSender: jest.fn(),
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
    const mockValidate = jest
      .spyOn(service, 'validateSender')
      .mockImplementation(() => Promise.resolve(null));

    const sender = await service.createSender({
      name: 'New Sender',
      email: 'sender@company.com',
      companyId: mockCompanyId,
    });
    expect(mockValidate).toHaveBeenCalledWith({
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

  it('should return sender already exists', async () => {
    const mockCompanyId = randomUUID();
    const mockSenderId = randomUUID();
    const mockValidate = jest
      .spyOn(service, 'validateSender')
      .mockImplementation(() =>
        Promise.resolve({
          id: mockSenderId,
          name: 'New Sender',
          email: 'sender@company.com',
          companyId: mockCompanyId,
        }),
      );

    expect(
      service.createSender({
        name: 'New Sender',
        email: 'sender@company.com',
        companyId: mockCompanyId,
      }),
    ).rejects.toThrowError(new Error(`Sender already exists`));
    expect(mockValidate).toHaveBeenCalledWith({
      email: 'sender@company.com',
      companyId: mockCompanyId,
    });
  });

  it('should return sender if is valid', async () => {
    const mockCompanyId = randomUUID();
    const mockSenderId = randomUUID();
    const mockGet = jest
      .spyOn(mockSenderRepository, 'getSender')
      .mockImplementation(() =>
        Promise.resolve({
          id: mockSenderId,
          name: 'Sender',
          email: 'sender@company.com',
          companyId: mockCompanyId,
        }),
      );

    const response = await service.validateSender({
      companyId: mockCompanyId,
      email: 'sender@company.com',
    });
    expect(mockGet).toHaveBeenCalledWith({
      email: 'sender@company.com',
      companyId: mockCompanyId,
    });
    expect(response).toMatchObject({
      id: expect.any(String),
      name: 'Sender',
      email: 'sender@company.com',
      companyId: mockCompanyId,
    });
  });

  it('should return null if is invalid', async () => {
    const mockCompanyId = randomUUID();
    const mockGet = jest
      .spyOn(mockSenderRepository, 'getSender')
      .mockImplementation(() => Promise.resolve(null));

    const response = await service.validateSender({
      companyId: mockCompanyId,
      email: 'sender@company.com',
    });
    expect(mockGet).toHaveBeenCalledWith({
      email: 'sender@company.com',
      companyId: mockCompanyId,
    });
    expect(response).toBeNull();
  });
});
