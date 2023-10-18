import { IsEnum } from 'class-validator';
import { AttendeeAnswerEnum } from './attendee.model';

export class CreateAttendeeDto {
  @IsEnum(AttendeeAnswerEnum)
  answer: AttendeeAnswerEnum;
}
