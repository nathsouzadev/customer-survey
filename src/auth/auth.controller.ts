import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import { AuthRequestModel } from './model/authRequest.model';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post()
  async login(@Request() request: any) {
    const data = request as AuthRequestModel;
    return this.authService.getToken(data.user);
  }
}
