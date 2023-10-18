import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attendee } from './attendee.entity';
import { CreateAttendeeDto } from './create-attendee-dto';

@Injectable()
export class AttendeesService {
  public constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  public async findAttendeesByEventId(
    eventId: number,
  ): Promise<Array<Attendee>> {
    return await this.attendeeRepository.find({
      where: { event: { id: eventId } },
    });
  }

  public async findOneByEventIdAndUserId(
    eventId: number,
    userId: number,
  ): Promise<Attendee | undefined> {
    return await this.attendeeRepository.findOne({
      where: { event: { id: eventId }, user: { id: userId } },
    });
  }

  public async createOrUpdate(
    input: CreateAttendeeDto,
    eventId: number,
    userId: number,
  ): Promise<Attendee> {
    const attendee =
      (await this.findOneByEventIdAndUserId(eventId, userId)) ?? new Attendee();

    attendee.userId = userId;
    attendee.eventId = eventId;
    attendee.answer = input.answer;

    return await this.attendeeRepository.save(attendee);
  }
}
