import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Event } from '../events/event.entity';
import { Expose } from 'class-transformer';
import { Attendee } from '../attendee/attendee.entity';

@Entity()
export class User {
  @Column()
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  username: string;

  @Column()
  password: string;

  @Column()
  @Expose()
  email: string;

  @Column()
  @Expose()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  @Expose()
  profile: Profile;

  @Expose()
  token?: string;

  @OneToMany(() => Event, (event) => event.organizer)
  @Expose()
  organizedEvents: Array<Event>;

  @OneToMany(() => Attendee, (event) => event.user)
  attended: Array<Attendee>;

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
}
