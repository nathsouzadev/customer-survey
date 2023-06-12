import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import { AuthRequestModel } from './model/authRequest.model';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginRequestDTO } from './dto/loginRequest.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'Return token when user have valid credentials',
    schema: { example: { token: 'some-token' } },
  })
  @ApiUnauthorizedResponse({
    description: 'Return error when does not have token',
  })
  @ApiBody({ type: LoginRequestDTO })
  @UseGuards(AuthGuard('local'))
  @Post()
  async login(@Request() request: AuthRequestModel) {
    const data = request;
    return this.authService.getToken(data.user);
  }
}
