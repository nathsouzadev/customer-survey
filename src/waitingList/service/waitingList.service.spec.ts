import { Test, TestingModule } from '@nestjs/testing';
import { WaitingListService } from './waitingList.service';
import { WaitingCompanyRepository } from '../repository/waitingCompany.repository';
import { randomUUID } from 'crypto';

describe('WaitingListService', () => {
  let service: WaitingListService;
  let mockWaitingCompanyRepository: WaitingCompanyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WaitingListService,
        {
          provide: WaitingCompanyRepository,
          useValue: {
            createWaitingCompany: jest.fn(),
            getWaitingCompany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WaitingListService>(WaitingListService);
    mockWaitingCompanyRepository = module.get<WaitingCompanyRepository>(
      WaitingCompanyRepository,
    );
  });

  it('should be return waitingCompany created', async () => {
    const mockCreate = jest
      .spyOn(mockWaitingCompanyRepository, 'createWaitingCompany')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          name: 'Ada Lovelace',
          email: 'ada@email.com',
          phoneNumber: '5511999991234',
          companyName: 'Company',
        }),
      );
    const mockGet = jest
      .spyOn(mockWaitingCompanyRepository, 'getWaitingCompany')
      .mockImplementation(() => Promise.resolve(null));
    const waitingCompany = await service.createWaitingCompany({
      name: 'Ada Lovelace',
      email: 'ada@email.com',
      phoneNumber: '11999991234',
      companyName: 'Company',
    });
    expect(mockGet).toHaveBeenCalledWith({
      email: 'ada@email.com',
      phoneNumber: '11999991234',
    });
    expect(mockCreate).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@email.com',
      phoneNumber: '11999991234',
      companyName: 'Company',
    });
    expect(waitingCompany).toMatchObject({
      id: expect.any(String),
      name: 'Ada Lovelace',
      email: 'ada@email.com',
      phoneNumber: '5511999991234',
      companyName: 'Company',
    });
  });

  it('should be return error if waitingCompany already exists', async () => {
    const mockCreate = jest.spyOn(
      mockWaitingCompanyRepository,
      'createWaitingCompany',
    );
    const mockGet = jest
      .spyOn(mockWaitingCompanyRepository, 'getWaitingCompany')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          name: 'Ada Lovelace',
          email: 'ada@email.com',
          phoneNumber: '5511999991234',
          companyName: 'Company',
        }),
      );
    expect(
      service.createWaitingCompany({
        name: 'Ada Lovelace',
        email: 'ada@email.com',
        phoneNumber: '11999991234',
        companyName: 'Company',
      }),
    ).rejects.toThrowError(new Error('User already in waiting list'));
    expect(mockGet).toHaveBeenCalledWith({
      email: 'ada@email.com',
      phoneNumber: '11999991234',
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
