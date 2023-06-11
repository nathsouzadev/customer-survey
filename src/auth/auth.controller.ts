import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import { AuthRequestModel } from './model/authRequest.model';
import { ApiCreatedResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({ schema: { example: { token: 'some-token' } } })
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard('local'))
  @Post()
  async login(@Request() request: AuthRequestModel) {
    const data = request;
    return this.authService.getToken(data.user);
  }
}
