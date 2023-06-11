import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { randomUUID } from 'crypto';

describe('JwtStrategy', () => {
  let service: JwtStrategy;

  beforeEach(async () => {
    process.env.TOKEN = 'somesecret';
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    service = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be return a company, when user is authenticated', async () => {
    const mockCompany = {
      id: randomUUID(),
      active: true,
      name: 'Company',
      email: 'company@email.com',
    };
    const company = await service.validate(mockCompany);
    expect(company).toMatchObject(mockCompany);
  });
});
