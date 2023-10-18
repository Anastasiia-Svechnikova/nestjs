import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user-dto';

@Injectable()
export class AuthService {
  public constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public getTokenForUser(user: User): string {
    return this.jwtService.sign({
      username: user.lastName,
      sub: user.id,
    });
  }

  public getUser(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async createUser(user: CreateUserDto): Promise<User> {
    const newUser = new User(user);

    if (user.password !== user.retypedPassword) {
      throw new BadRequestException('Password do not match');
    }

    const existingUser = await this.userRepository.find({
      where: [{ username: user.username }, { email: user.email }],
    });

    if (existingUser.length) {
      throw new BadRequestException('User Name or Email already exists');
    }

    newUser.username = user.username;
    newUser.email = user.email;
    newUser.password = await this.hashPassword(user.password);
    newUser.lastName = user.lastName;
    newUser.firstName = user.firstName;

    return new User({
      ...(await this.userRepository.save(newUser)),
      token: this.getTokenForUser(newUser),
    });
  }
}
