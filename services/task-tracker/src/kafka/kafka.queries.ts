import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class KafkaQueries {
  constructor(@Inject('Knex') private readonly knex: Knex) {}

  public createUser(data: {
    public_id: string;
    login: string;
    role: string;
  }): Knex.QueryBuilder {
    return this.knex('tasks.users')
      .insert(data)
      .onConflict('public_id')
      .ignore();
  }
}
