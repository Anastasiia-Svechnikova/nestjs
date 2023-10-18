import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EventsService } from './events.service';
import { AttendeesService } from '../attendee/attendee.service';
import { PaginationResult } from '../pagination/pagination.model';
import { Event } from './event.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.entity';
import { Attendee } from '../attendee/attendee.entity';
import { CreateAttendeeDto } from '../attendee/create-attendee-dto';

@Controller('events-attendance')
export class EventsAttendanceController {
  public constructor(
    private readonly eventsService: EventsService,
    private readonly attendeesService: AttendeesService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  public async findAll(
    @CurrentUser() currentUser: User,
    @Query('page', ParseIntPipe) page: number = 1,
  ): Promise<PaginationResult<Event>> {
    return await this.eventsService.getEventsByUserIdPaginated(currentUser.id, {
      page,
    });
  }

  @Get('/:eventId')
  @UseGuards(AuthGuard('jwt'))
  public async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() currentUser: User,
  ): Promise<Attendee> {
    const attendee: Attendee =
      await this.attendeesService.findOneByEventIdAndUserId(
        eventId,
        currentUser.id,
      );

    if (!attendee) {
      throw new NotFoundException();
    }
    return attendee;
  }

  @Put('/:eventId')
  @UseGuards(AuthGuard('jwt'))
  public async CreateOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() input: CreateAttendeeDto,
    @CurrentUser() currentUser: User,
  ): Promise<Attendee> {
    return this.attendeesService.createOrUpdate(input, eventId, currentUser.id);
  }
}
