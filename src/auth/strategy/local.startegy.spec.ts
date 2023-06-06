import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../service/auth.service';
import { LocalStrategy } from './local.strategy';
import { AppLogger } from '../../utils/appLogger';
import { randomUUID } from 'crypto';

describe('LocalStrategy', () => {
  let service: LocalStrategy;
  let mockAuthService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateCompany: jest.fn(),
          },
        },
        AppLogger,
      ],
    }).compile();

    service = module.get<LocalStrategy>(LocalStrategy);
    mockAuthService = module.get<AuthService>(AuthService);
  });

  it('should be return a user, when user is authenticated', async () => {
    jest.spyOn(mockAuthService, 'validateCompany').mockImplementation(() =>
      Promise.resolve({
        id: randomUUID(),
        active: true,
        name: 'Company',
        email: 'company@email.com',
      }),
    );
    const company = await service.validate('company@email.com', 'password');
    expect(company).toMatchObject({
      id: expect.any(String),
      active: true,
      name: 'Company',
      email: 'company@email.com',
    });
  });

  it('should throw a error when user is not authenticated', async () => {
    jest
      .spyOn(mockAuthService, 'validateCompany')
      .mockImplementation(() => Promise.resolve(null));

    await expect(
      service.validate('company@email.com', 'wrong-password'),
    ).rejects.toThrow(new UnauthorizedException());
  });
});
