import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { AttendeesService } from './attendee.service';
import { Attendee } from './attendee.entity';

@Controller('events/:eventId/attendees')
export class AttendeesController {
  public constructor(private readonly attendeesService: AttendeesService) {}

  @Get()
  public async findAll(
    @Param('eventId', ParseIntPipe) eventId: number,
  ): Promise<Array<Attendee>> {
    return await this.attendeesService.findAttendeesByEventId(eventId);
  }
}
