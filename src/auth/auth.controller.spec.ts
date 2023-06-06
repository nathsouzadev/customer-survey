import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { randomUUID } from 'crypto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: {
            getToken: jest.fn(),
          },
        },
      ],
    }).compile();

    mockAuthService = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should return a token', async () => {
    const mockCompany = {
      id: randomUUID(),
      active: true,
      email: 'company@email.com',
      name: 'Company',
    };
    jest.spyOn(mockAuthService, 'getToken').mockImplementation(() =>
      Promise.resolve({
        token: 'token',
      }),
    );
    const token = await controller.login({
      company: mockCompany,
    });

    expect(token).toMatchObject({
      token: 'token',
    });
  });
});
