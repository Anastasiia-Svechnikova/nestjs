import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { User } from './user.entity';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secret123',
      signOptions: {
        expiresIn: '120m',
      },
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [LocalStrategy, AuthService, JwtStrategy],
})
export class AuthModule {}
