import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { CompanyRepository } from '../repository/company.repository';
import { randomUUID } from 'crypto';

describe('CompanyService', () => {
  let service: CompanyService;
  let mockCompanyRepository: CompanyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: CompanyRepository,
          useValue: {
            saveCompany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    mockCompanyRepository = module.get<CompanyRepository>(CompanyRepository);
  });

  it('should be return company create', async () => {
    const mockCreateRequest = {
      name: 'Company',
      email: 'company@email.com',
    };
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
    expect(mockSaveCompany).toHaveBeenCalledWith(mockCreateRequest);
    expect(company).toMatchObject({
      id: expect.any(String),
      active: true,
      name: 'Company',
      email: 'company@email.com',
    });
  });
});
