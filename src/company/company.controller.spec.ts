import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './service/company.service';
import { CompanyRepository } from './repository/company.repository';
import { randomUUID } from 'crypto';

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
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    mockCompanyService = module.get<CompanyService>(CompanyService);
  });

  it('should be return company created', async () => {
    const mockCreateCompanyRequest = {
      name: 'Company',
      email: 'company@email.com',
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
});
