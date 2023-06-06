import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CompanyService } from '../../company/service/company.service';
import { CompanyModel } from '../../company/model/company.model';

@Injectable()
export class AuthService {
  constructor(
    private companyService: CompanyService,
    private jwtService: JwtService,
  ) {}

  validateCompany = async (authRequest: {
    email: string;
    password: string;
  }): Promise<CompanyModel> => this.companyService.getAuthCompany(authRequest);

  getToken = async (company: CompanyModel): Promise<{ token: string }> => {
    const token = this.jwtService.sign(
      { ...company },
      { secret: process.env.TOKEN },
    );

    return { token };
  };
}
