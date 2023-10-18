import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsString, Length } from 'class-validator';
import { Attendee } from '../attendee/attendee.entity';

export class EventsDTO {
  id: number;

  @IsString()
  @Length(5, 255)
  name: string;

  @IsDateString()
  timeStart: Date;

  @IsString()
  description: string;

  @IsString()
  @Length(5, 255)
  address: string;

  attendees: Array<Attendee>;
}

export class UpdateEventDTO extends PartialType(EventsDTO) {}

export class ListEvents {
  when: EventDateType = EventDateType.all;
  page: number = 1;
}

export enum EventDateType {
  all = 'all',
  today = 'today',
  tomorrow = 'tomorrow',
  thisWeek = 'thisWeek',
  nextWeek = 'nextWeek',
}
