import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { v4 } from 'uuid';

import { UsersQueries } from './users.queries';
import { validateEvent } from '../helper';

import { User, UserDto } from './interfaces';

const EVENT = 'user.created';
const EVENT_VERSION = 2;

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
    const eventData = {
      event_id: v4(),
      producer: 'auth_service',
      event_name: 'userCreated',
      data: {
        public_id: user.public_id,
        login: user.login,
        role: user.role,
      },
    };

    if (validateEvent(eventData, EVENT, EVENT_VERSION)) {
      this.kafkaClient.emit('users-stream', eventData);
    } else {
      throw new Error(`not valid: ${JSON.stringify(eventData)}`);
    }

    return user;
  }

  public async getUsers(): Promise<User[]> {
    return this.usersQueries.getUsers();
  }
}
