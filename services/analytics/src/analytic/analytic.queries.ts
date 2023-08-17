import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class AnalyticQueries {
  constructor(@Inject('Knex') private readonly knex: Knex) {}

  public getDayTotal(date: Date): Knex.QueryBuilder {
    return this.knex('analytics.log')
      .sum('price')
      .whereRaw('date = ?::date', date);
  }

  public getMinusUserCount(date: Date): Knex.QueryBuilder {
    return this.knex('analytics.account')
      .count()
      .whereRaw('date = ?::date', date)
      .andWhere('balance_end', '<', 0);
  }

  public getMaxPrice(date: Date): Knex.QueryBuilder {
    return this.knex('analytics.log')
      .max('price')
      .whereRaw('date = ?::date', date);
  }
}
