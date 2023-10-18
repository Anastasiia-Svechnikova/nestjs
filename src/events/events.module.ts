import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Attendee } from '../attendee/attendee.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { AttendeesService } from '../attendee/attendee.service';
import { AttendeesController } from '../attendee/attendee.controller';
import { EventsByUserController } from './events-by-user.controller';
import { EventsAttendanceController } from './events-attendance-controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [
    EventsController,
    AttendeesController,
    EventsByUserController,
    EventsAttendanceController,
  ],
  providers: [EventsService, AttendeesService],
})
export class EventsModule {}
