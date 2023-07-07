import { Test, TestingModule } from '@nestjs/testing';
import { WaitingListController } from './waitingList.controller';
import { WaitingListService } from './service/waitingList.service';
import { AppLogger } from '../utils/appLogger';
import { WaitingCompanyRepository } from './repository/waitingCompany.repository';
import { randomUUID } from 'crypto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('WaitingListController', () => {
  let controller: WaitingListController;
  let mockWaitinListService: WaitingListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitingListController],
      providers: [
        {
          provide: WaitingListService,
          useValue: {
            createWaitingCompany: jest.fn(),
          },
        },
        {
          provide: WaitingCompanyRepository,
          useValue: {},
        },
        AppLogger,
      ],
    }).compile();

    controller = module.get<WaitingListController>(WaitingListController);
    mockWaitinListService = module.get<WaitingListService>(WaitingListService);
  });

  it('should return waitingCompany created', async () => {
    const mockCreate = jest
      .spyOn(mockWaitinListService, 'createWaitingCompany')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          name: 'Ada Lovelace',
          email: 'ada@email.com',
          phoneNumber: '5511999991234',
          companyName: 'Company',
        }),
      );
    const mockCreateWaitingCompanyRequest = {
      name: 'Ada Lovelace',
      email: 'ada@email.com',
      phoneNumber: '11999991234',
      companyName: 'Company',
    };
    const waitingCompany = await controller.createWaitingCompany(
      {
        headers: {},
      },
      mockCreateWaitingCompanyRequest,
    );
    expect(mockCreate).toHaveBeenCalledWith(mockCreateWaitingCompanyRequest);
    expect(waitingCompany).toMatchObject({
      waitingCompanyCreated: {
        id: expect.any(String),
        name: 'Ada Lovelace',
        email: 'ada@email.com',
        phoneNumber: '5511999991234',
        companyName: 'Company',
      },
    });
  });

  it('should return error when user already in waiting list', async () => {
    const mockCreate = jest
      .spyOn(mockWaitinListService, 'createWaitingCompany')
      .mockImplementation(() => {
        throw new Error('User already in waiting list');
      });
    const mockCreateWaitingCompanyRequest = {
      name: 'Ada Lovelace',
      email: 'ada@email.com',
      phoneNumber: '11999991234',
      companyName: 'Company',
    };
    expect(
      controller.createWaitingCompany(
        {
          headers: {},
        },
        mockCreateWaitingCompanyRequest,
      ),
    ).rejects.toThrow(
      new HttpException('User already in waiting list', HttpStatus.CONFLICT),
    );
    expect(mockCreate).toHaveBeenCalledWith(mockCreateWaitingCompanyRequest);
  });
});
