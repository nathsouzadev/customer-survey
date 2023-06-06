import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CompanyModel } from '../../company/model/company.model';
import { AppLogger } from '../../utils/appLogger';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly logger: AppLogger,
    private authService: AuthService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<CompanyModel> {
    const company = await this.authService.validateCompany({ email, password });

    if (!company) {
      this.logger.error(`Invalid email or password for ${email}`);
      throw new UnauthorizedException();
    }

    return company;
  }
}
