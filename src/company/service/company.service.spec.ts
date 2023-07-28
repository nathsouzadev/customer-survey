import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { CompanyRepository } from '../repository/company.repository';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { AppLogger } from '../../utils/appLogger';
import { PhoneCompanyRepository } from '../repository/phoneCompany.repository';

jest.mock('bcryptjs');

describe('CompanyService', () => {
  let service: CompanyService;
  let mockCompanyRepository: CompanyRepository;
  let mockPhoneCompanyRepository: PhoneCompanyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: CompanyRepository,
          useValue: {
            saveCompany: jest.fn(),
            getCompanyByEmail: jest.fn(),
            getCompany: jest.fn(),
          },
        },
        {
          provide: PhoneCompanyRepository,
          useValue: {
            getPhoneByCompanyId: jest.fn(),
          },
        },
        AppLogger,
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    mockCompanyRepository = module.get<CompanyRepository>(CompanyRepository);
    mockPhoneCompanyRepository = module.get<PhoneCompanyRepository>(
      PhoneCompanyRepository,
    );
  });

  it('should be return company create', async () => {
    const mockCreateRequest = {
      name: 'Company',
      email: 'company@email.com',
      password: 'password',
    };

    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve('3ncrypt3d'));
    const mockSaveCompany = jest
      .spyOn(mockCompanyRepository, 'saveCompany')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          active: true,
          name: 'Company',
          email: 'company@email.com',
        }),
      );

    const company = await service.createCompany(mockCreateRequest);
    expect(mockSaveCompany).toHaveBeenCalledWith({
      ...mockCreateRequest,
      password: '3ncrypt3d',
    });
    expect(company).toMatchObject({
      id: expect.any(String),
      active: true,
      name: 'Company',
      email: 'company@email.com',
    });
  });

  it('should be return company with email', async () => {
    const mockCompanyId = randomUUID();
    const mockGetCompany = jest
      .spyOn(mockCompanyRepository, 'getCompanyByEmail')
      .mockImplementation(() =>
        Promise.resolve({
          id: mockCompanyId,
          active: true,
          name: 'Company',
          email: 'company@email.com',
          surveys: [
            {
              id: randomUUID(),
              companyId: mockCompanyId,
              name: 'Survey',
              title: 'Main survey',
            },
          ],
        }),
      );

    const company = await service.getCompanyByEmail('company@email.com');
    expect(mockGetCompany).toHaveBeenCalledWith('company@email.com');
    expect(company).toMatchObject({
      id: mockCompanyId,
      active: true,
      name: 'Company',
      email: 'company@email.com',
      surveys: [
        {
          id: expect.any(String),
          companyId: mockCompanyId,
          name: 'Survey',
          title: 'Main survey',
        },
      ],
    });
  });

  it('should be return auth company with correct password', async () => {
    const mockAuthRequest = {
      email: 'company@email.com',
      password: 'password',
    };
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));
    const mockGetAuthCompany = jest
      .spyOn(mockCompanyRepository, 'getCompany')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          active: true,
          name: 'Company',
          email: 'company@email.com',
          password: 'password',
        }),
      );

    const company = await service.getAuthCompany(mockAuthRequest);
    expect(mockGetAuthCompany).toHaveBeenCalledWith('company@email.com');
    expect(company).toMatchObject({
      id: expect.any(String),
      active: true,
      name: 'Company',
      email: 'company@email.com',
    });
  });

  it('should be return null with incorrect password', async () => {
    const mockAuthRequest = {
      email: 'company@email.com',
      password: 'wrong-password',
    };
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(false));
    const mockGetAuthCompany = jest
      .spyOn(mockCompanyRepository, 'getCompany')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          active: true,
          name: 'Company',
          email: 'company@email.com',
          password: 'password',
        }),
      );

    const company = await service.getAuthCompany(mockAuthRequest);
    expect(mockGetAuthCompany).toHaveBeenCalledWith('company@email.com');
    expect(company).toBeNull();
  });

  it('should be return phoneCompany with companyId', async () => {
    const mockCompanyId = randomUUID();
    const mockGetPhone = jest
      .spyOn(mockPhoneCompanyRepository, 'getPhoneByCompanyId')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          active: true,
          phoneNumber: '5511999995555',
          companyId: mockCompanyId,
          metaId: '1234567890',
        }),
      );

    const phoneCompany = await service.getPhoneByCompanyId(mockCompanyId);
    expect(mockGetPhone).toHaveBeenCalledWith(mockCompanyId);
    expect(phoneCompany).toMatchObject({
      id: expect.any(String),
      active: true,
      phoneNumber: '5511999995555',
      companyId: mockCompanyId,
      metaId: '1234567890',
    });
  });
});
