import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class UsersQueries {
  constructor(@Inject('Knex') private readonly knex: Knex) {}

  public getUsers(): Knex.QueryBuilder {
    return this.knex('auth.users');
  }

  public getUser(login: string): Knex.QueryBuilder {
    return this.knex('auth.users')
      .first('public_id', 'login', 'password', 'role')
      .where('login', login);
  }

  public createUser(data: {
    login: string;
    password: string;
    role: string;
  }): Knex.QueryBuilder {
    return this.knex('auth.users').insert(data).returning('*');
  }
}
