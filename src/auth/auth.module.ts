import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './auth.controller';
import { CompanyModule } from '../company/company.module';
import { CompanyService } from '../company/service/company.service';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { companyProviders } from '../config/providers/companyProviders';
import { PrismaService } from '../client/prisma/prisma.service';

@Module({
  imports: [CompanyModule, PassportModule, JwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    CompanyService,
    LocalStrategy,
    ...companyProviders,
    PrismaService,
  ],
})
export class AuthModule {}
