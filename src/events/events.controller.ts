import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeleteResult } from 'typeorm';

import { EventsDTO, UpdateEventDTO } from './events.model';
import { EventsService } from './events.service';
import { PaginationResult } from '../pagination/pagination.model';
import { Event } from './event.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.entity';

@Controller('/events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  public constructor(private eventsService: EventsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  public getAll(): Promise<PaginationResult<Event>> {
    return this.eventsService.getAllEventsPaginated();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  public async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EventsDTO> {
    const event = await this.eventsService.findEventWithAttendeeCount(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  public async create(
    @Body() body: EventsDTO,
    @CurrentUser() currentUser: User,
  ): Promise<Event> {
    return new Event(await this.eventsService.createOne(body, currentUser));
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  public delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ): Promise<DeleteResult> {
    return this.eventsService.deleteOne(id, currentUser);
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEventDTO,
    @CurrentUser() currentUser: User,
  ): Promise<EventsDTO> {
    return new Event(await this.eventsService.update(id, body, currentUser));
  }
}
