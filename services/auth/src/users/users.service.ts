import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { UsersQueries } from './users.queries';
import { User, UserDto } from './interfaces';

@Injectable()
export class UsersService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly usersQueries: UsersQueries,
  ) {}

  public async findOne(login: string): Promise<User | undefined> {
    return this.usersQueries.getUser(login);
  }

  public async createUser(data: UserDto): Promise<User> {
    const [user] = await this.usersQueries.createUser(data);

    this.kafkaClient.emit('users_stream', user);

    return user;
  }

  public async getUsers(): Promise<User[]> {
    return this.usersQueries.getUsers();
  }
}
