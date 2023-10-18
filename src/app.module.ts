import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Event } from './events/event.entity';
import { Attendee } from './attendee/attendee.entity';
import { User } from './auth/user.entity';
import { Profile } from './auth/profile.entity';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import * as process from 'process';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      password: process.env.PASSWORD,
      username: process.env.USERNAME,
      database: process.env.DATABASE,
      host: '127.0.0.1',
      port: 3306,
      entities: [Event, Attendee, User, Profile],
      synchronize: true,
    }),
    EventsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
