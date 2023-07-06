import { Test, TestingModule } from '@nestjs/testing';
import { SenderController } from './sender.controller';
import { SenderService } from './service/sender.service';
import { AppLogger } from '../utils/appLogger';
import { randomUUID } from 'crypto';
import { SenderRepository } from './repository/sender.repository';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('SenderController', () => {
  let controller: SenderController;
  let mockSenderService: SenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SenderController],
      providers: [
        {
          provide: SenderService,
          useValue: {
            createSender: jest.fn(),
          },
        },
        {
          provide: SenderRepository,
          useValue: {},
        },
        AppLogger,
      ],
    }).compile();

    controller = module.get<SenderController>(SenderController);
    mockSenderService = module.get<SenderService>(SenderService);
  });

  it('should return sender created', async () => {
    const mockCompanyId = randomUUID();
    const mockCreate = jest
      .spyOn(mockSenderService, 'createSender')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          name: 'New Sender',
          email: 'sender@company.com',
          companyId: mockCompanyId,
        }),
      );
    const response = await controller.createSender(
      {
        headers: {},
      },
      {
        name: 'New Sender',
        email: 'sender@company.com',
        companyId: mockCompanyId,
      },
    );
    expect(mockCreate).toHaveBeenCalledWith({
      name: 'New Sender',
      email: 'sender@company.com',
      companyId: mockCompanyId,
    });
    expect(response).toMatchObject({
      senderCreated: {
        id: expect.any(String),
        name: 'New Sender',
        email: 'sender@company.com',
        companyId: mockCompanyId,
      },
    });
  });

  it('should return error when sender already exists', async () => {
    const mockCompanyId = randomUUID();
    const mockCreate = jest
      .spyOn(mockSenderService, 'createSender')
      .mockImplementation(() => {
        throw new Error('Sender already exists');
      });
    expect(
      controller.createSender(
        {
          headers: {},
        },
        {
          name: 'New Sender',
          email: 'sender@company.com',
          companyId: mockCompanyId,
        },
      ),
    ).rejects.toThrow(
      new HttpException('Sender already exists', HttpStatus.CONFLICT),
    );
    expect(mockCreate).toHaveBeenCalledWith({
      name: 'New Sender',
      email: 'sender@company.com',
      companyId: mockCompanyId,
    });
  });
});
