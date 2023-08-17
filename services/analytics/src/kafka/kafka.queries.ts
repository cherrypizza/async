import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

import { Task, User, AccountLog, Account } from '../interfaces';

@Injectable()
export class KafkaQueries {
  constructor(@Inject('Knex') private readonly knex: Knex) {}

  public createUser(data: User): Knex.QueryBuilder {
    return this.knex('analytics.users')
      .insert(data)
      .onConflict('public_id')
      .ignore();
  }

  public createTask(data: Task): Knex.QueryBuilder {
    return this.knex('analytics.tasks')
      .insert(data)
      .onConflict('public_id')
      .ignore();
  }

  public addLog(data: AccountLog): Knex.QueryBuilder {
    return this.knex('analytics.log')
      .insert(data)
      .onConflict('public_id')
      .ignore();
  }

  public upsertAccount(data: Account): Knex.QueryBuilder {
    return this.knex('analytics.account')
      .insert(data)
      .onConflict('public_id')
      .merge();
  }
}
