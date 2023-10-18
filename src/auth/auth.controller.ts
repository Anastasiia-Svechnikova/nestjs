import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoginResponse } from './auth.model';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  public async login(@CurrentUser() user: User): Promise<LoginResponse> {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  public async getProfile(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
