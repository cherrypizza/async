import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

import { Task, User } from '../interfaces';

@Injectable()
export class KafkaQueries {
  constructor(@Inject('Knex') private readonly knex: Knex) {}

  public createUser(data: User): Knex.QueryBuilder {
    return this.knex('accounting.users')
      .insert(data)
      .onConflict('public_id')
      .ignore();
  }

  public createAccount(data): Knex.QueryBuilder {
    return this.knex('accounting.account').insert(data);
  }

  public createTask(data: Task): Knex.QueryBuilder {
    return this.knex('accounting.tasks')
      .insert(data)
      .onConflict('public_id')
      .ignore();
  }

  public moneyDown(data: {
    task: string;
    user: string;
    created: Date;
    price: number;
  }): Knex.QueryBuilder {
    return this.knex('accounting.log').insert(data).returning('*');
  }

  public moneyUp(data: { task: string; user: string; date: Date }): Knex.Raw {
    const { task, user, date } = data;

    return this.knex.raw(
      `
    insert into accounting.log ("user", task, created, price)
    select ?, ?, ?, (
      select price2
      from accounting.tasks
      where public_id = ?
    )
    returning *
    `,
      [user, task, date, task],
    );
  }
}
