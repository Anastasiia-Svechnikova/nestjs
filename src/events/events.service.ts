import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';

import {
  EventDateType,
  EventsDTO,
  ListEvents,
  UpdateEventDTO,
} from './events.model';
import { paginate } from '../pagination/paginator';
import {
  PaginationOptions,
  PaginationResult,
} from '../pagination/pagination.model';
import { AttendeeAnswerEnum } from '../attendee/attendee.model';
import { User } from '../auth/user.entity';
import { defaultPaginationOptions } from '../pagination/constants';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(@InjectRepository(Event) private repository: Repository<Event>) {}

  private getEventsQueryBuilder(): SelectQueryBuilder<Event> {
    return this.repository.createQueryBuilder('e').addOrderBy('e.id', 'DESC');
  }

  public getEventsWithAttendeeCountQuery(): SelectQueryBuilder<Event> {
    return this.getEventsQueryBuilder()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      );
  }

  private getEventsWithAttendeeCountFilteredQuery(
    filter?: ListEvents,
  ): SelectQueryBuilder<Event> {
    const query = this.getEventsWithAttendeeCountQuery();
    if (!filter || filter.when === EventDateType.all) {
      return query;
    }
    switch (filter.when) {
      case EventDateType.today:
        return query.andWhere(
          'e.timeStart >= CURDATE() AND e.timeStart <= CURDATE() + INTERVAL 1 DAY',
        );
      case EventDateType.tomorrow:
        return query.andWhere(
          'e.timeStart >= CURDATE() + INTERVAl 1 DAY AND e.timeStart <= CURDATE() + INTERVAL 2 DAY',
        );
      case EventDateType.thisWeek:
        return query.andWhere(
          'YEARWEEK(event.timeStart, 1) = YEARWEEK(CURDATE(), 1)',
        );
      case EventDateType.nextWeek:
        return query.andWhere(
          'YEARWEEK(event.timeStart, 1) = YEARWEEK(CURDATE(), 1) + 1',
        );
      default:
        return query;
    }
  }

  public async getAllEventsPaginated(): Promise<PaginationResult<Event>> {
    const query = this.getEventsWithAttendeeCountFilteredQuery();

    return await paginate<Event>(query, defaultPaginationOptions);
  }

  public async findEventWithAttendeeCount(id: number): Promise<Event> {
    const query = this.getEventsWithAttendeeCountQuery().andWhere(
      'e.id = :id',
      {
        id,
      },
    );
    return await query.getOne();
  }

  public findOne(id: number): Promise<Event | undefined> {
    return this.repository.findOne({ where: { id } });
  }

  public async createOne(body: EventsDTO, user: User): Promise<Event> {
    return await this.repository.save({
      ...body,
      organizer: user,
      timeStart: new Date(body.timeStart),
    });
  }

  public async deleteOne(id: number, user: User): Promise<DeleteResult> {
    const event = await this.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (user.id !== event.organizerId) {
      throw new ForbiddenException(
        null,
        'You are not authorized to delete this event',
      );
    }
    return await this.repository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  public async update(
    id: number,
    body: UpdateEventDTO,
    user: User,
  ): Promise<Event> {
    const event: Event = await this.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (user.id !== event.organizerId) {
      throw new ForbiddenException(
        null,
        'You are not authorized to delete this event',
      );
    }

    const updatedEvent: Event = {
      ...event,
      ...body,
      timeStart: body.timeStart ? new Date(body.timeStart) : event.timeStart,
    };
    return await this.repository.save(updatedEvent);
  }

  public async getEventsByOrganizerIdPaginated(
    userId: number,
    paginationOptions?: PaginationOptions,
  ): Promise<PaginationResult<Event>> {
    const query = this.getEventsByOrganizerIdQuery(userId);

    return await paginate<Event>(query, {
      ...defaultPaginationOptions,
      ...paginationOptions,
    });
  }

  public async getEventsByUserIdPaginated(
    userId: number,
    paginationOptions?: PaginationOptions,
  ): Promise<PaginationResult<Event>> {
    const query = this.getEventsByUserIdQuery(userId);

    return await paginate<Event>(query, {
      ...defaultPaginationOptions,
      ...paginationOptions,
    });
  }

  private getEventsByOrganizerIdQuery(
    userId: number,
  ): SelectQueryBuilder<Event> {
    return this.getEventsQueryBuilder().where('e.organizerId = : userId', {
      userId,
    });
  }

  private getEventsByUserIdQuery(userId: number): SelectQueryBuilder<Event> {
    return this.getEventsQueryBuilder()
      .leftJoinAndSelect('e.attendees', 'a')
      .where('a.userId = :userId', { userId });
  }
}
