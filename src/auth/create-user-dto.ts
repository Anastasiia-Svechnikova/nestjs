import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @Length(3)
  username: string;

  @Length(5)
  password: string;

  @Length(5)
  retypedPassword: string;

  @Length(2)
  firstName: string;

  @Length(2)
  lastName: string;

  @IsEmail()
  email: string;
}
