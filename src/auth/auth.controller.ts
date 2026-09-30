import {
  Body,
  Post,
  Controller,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto) {
    const userToken = await this.authService.validateUser(data);

    if (!userToken)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    return userToken;
  }
}
