import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CompanyService } from '../../company/service/company.service';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

describe('AuthService', () => {
  let service: AuthService;
  let mockCompanyService: CompanyService;
  let mockJwtService: JwtService;

  beforeEach(async () => {
    process.env.TOKEN = 'some-secret';
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CompanyService,
          useValue: {
            getAuthCompany: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockCompanyService = module.get<CompanyService>(CompanyService);
    mockJwtService = module.get<JwtService>(JwtService);
  });

  it('should be return a company, when company is authenticated', async () => {
    const mockGetAuth = jest
      .spyOn(mockCompanyService, 'getAuthCompany')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          active: true,
          name: 'Company',
          email: 'company@email.com',
        }),
      );
    const company = await service.validateCompany({
      email: 'company@email.com',
      password: 'password',
    });
    expect(mockGetAuth).toBeCalledWith({
      email: 'company@email.com',
      password: 'password',
    });
    expect(company).toMatchObject({
      id: expect.any(String),
      active: true,
      name: 'Company',
      email: 'company@email.com',
    });
  });

  it('should return a token when user is authenticated', async () => {
    const mockCompany = {
      id: randomUUID(),
      active: true,
      name: 'Company',
      email: 'company@email.com',
    };
    jest.spyOn(mockJwtService, 'sign').mockImplementation(() => 'token');
    const token = await service.getToken(mockCompany);
    expect(mockJwtService.sign).toHaveBeenCalledWith(
      { ...mockCompany },
      { secret: 'some-secret' },
    );
    expect(token).toMatchObject({ token: 'token' });
  });
});
