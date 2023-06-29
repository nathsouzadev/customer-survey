import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './service/company.service';
import { CompanyRepository } from './repository/company.repository';
import { randomUUID } from 'crypto';
import { AppLogger } from '../utils/appLogger';
import { PhoneCompanyRepository } from './repository/phoneCompany.repository';

describe('CompanyController', () => {
  let controller: CompanyController;
  let mockCompanyService: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        CompanyService,
        {
          provide: CompanyRepository,
          useValue: {},
        },
        {
          provide: PhoneCompanyRepository,
          useValue: {},
        },
        AppLogger,
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    mockCompanyService = module.get<CompanyService>(CompanyService);
  });

  it('should be return company created', async () => {
    const mockCreateCompanyRequest = {
      name: 'Company',
      email: 'company@email.com',
      password: 'password',
    };
    const mockCreate = jest
      .spyOn(mockCompanyService, 'createCompany')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          active: true,
          name: 'Company',
          email: 'company@email.com',
        }),
      );

    const company = await controller.createCompany(mockCreateCompanyRequest);
    expect(mockCreate).toHaveBeenCalledWith(mockCreateCompanyRequest);
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
      .spyOn(mockCompanyService, 'getCompanyByEmail')
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

    const company = await controller.getCompanyByEmail('company@email.com');
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
});
