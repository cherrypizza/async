import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class TasksQueries {
  constructor(@Inject('Knex') private readonly knex: Knex) {}

  public getTasks(userId: string): Knex.QueryBuilder {
    return this.knex('tasks.tasks').where('executor', userId);
  }

  public createTask(data: {
    description: string;
    executor: string;
    price1: number;
    price2: number;
    isClosed: boolean;
  }): Knex.QueryBuilder {
    return this.knex('tasks.tasks').insert(data).returning('*');
  }

  public closeTask(id: number): Knex.QueryBuilder {
    return this.knex('tasks.tasks')
      .update({ isClosed: true })
      .where('id', id)
      .returning('*');
  }

  public getRandomUser(): Knex.QueryBuilder {
    return this.knex('tasks.users')
      .first('public_id')
      .where('role', 'worker')
      .orderByRaw('random()');
  }

  public getOpenTasks(): Knex.QueryBuilder<{ id: number }, { id: number }[]> {
    return this.knex('tasks.tasks').select('id').where('isClosed', false);
  }

  public getWorkers(): Knex.QueryBuilder<
    { public_id: string },
    { public_id: string }[]
  > {
    return this.knex('tasks.users').select('public_id').where('role', 'worker');
  }

  public reassignTasks(
    data: {
      id: number;
      executor: string;
    }[],
  ): Knex.QueryBuilder {
    return this.knex('tasks.tasks')
      .insert(data)
      .onConflict('id')
      .merge(['executor'])
      .returning('*');
  }
}
