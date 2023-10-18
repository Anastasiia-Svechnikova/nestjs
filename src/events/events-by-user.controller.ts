import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { PaginationResult } from '../pagination/pagination.model';
import { Event } from './event.entity';

@Controller('events-user/:userId')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsByUserController {
  public constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  public async findAllEvents(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', ParseIntPipe) page: number = 1,
  ): Promise<PaginationResult<Event>> {
    console.log(userId);
    return this.eventsService.getEventsByOrganizerIdPaginated(userId, { page });
  }
}
