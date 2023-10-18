import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from './create-user-dto';
import { User } from './user.entity';

@Controller('users')
@SerializeOptions({ strategy: 'excludeAll' })
export class UsersController {
  public constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  public async register(@Body() body: CreateUserDto): Promise<User> {
    return this.authService.createUser(body);
  }
}
