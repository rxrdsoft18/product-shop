import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserDetails } from '../user/user-details.interface';
import { ExistingUserDto } from '../user/dtos/existing-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserDetails | string> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body() existingUserDto: ExistingUserDto,
  ): Promise<{ token: string } | string> {
    console.log('existingUserDto', existingUserDto);
    return this.authService.login(existingUserDto);
  }

  @Post('verify-jwt')
  async verifyJwt(
    @Body() payload: { token: string },
  ): Promise<{ exp: number }> {
    console.log('verify token', payload);
    return this.authService.verifyJwt(payload.token);
  }
}
