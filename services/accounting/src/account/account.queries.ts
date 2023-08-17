import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class AccountQueries {
  constructor(@Inject('Knex') private readonly knex: Knex) {}

  public getLog(date: Date): Knex.QueryBuilder {
    return this.knex('accounting.log')
      .select(['description', 'price'])
      .join(
        'accounting.tasks',
        'accounting.log.task',
        'accounting.tasks.public_id',
      )
      .andWhere('created', '>', date)
      .orderBy('created');
  }

  public getUserLog(userId: string, date: Date): Knex.QueryBuilder {
    return this.getLog(date).where('accounting.log.user', userId);
  }

  public getAccount(userId: string, date: Date): Knex.QueryBuilder {
    return this.knex('accounting.account')
      .first(['balance_start', 'balance_end', 'pay'])
      .where('accounting.log.user', userId)
      .andWhereRaw('created = ?::date', date);
  }

  public updateDayEndBalance(date: Date): Knex.QueryBuilder {
    return this.knex
      .with(
        'balance',
        this.knex('accounting.users')
          .select([
            'accounting.users.public_id as "user"',
            this.knex.raw('sum(accounting.log.price) as sum_log'),
          ])
          .leftJoin('accounting.log', (join) => {
            return join
              .on('accounting.users.public_id', '=', 'accounting.log.user')
              .on('accounting.log.created', '>', date.toISOString());
          })
          .leftJoin(
            'accounting.tasks',
            'accounting.log.task',
            'accounting.tasks.public_id',
          )
          .groupBy('accounting.users.public_id'),
      )
      .table('accounting.account')
      .update({
        balance_end: this.knex.raw(
          'balance_start + coalesce(sum_log, 0::money)',
        ),
        pay: this.knex.raw(
          'case when balance_end > 0::money then balance_end else 0::money end',
        ),
      })
      .updateFrom('balance')
      .where('accounting.account.user', '=', 'balance.user')
      .andWhereRaw('accounting.account.date = ?::date', date)
      .returning('*');
  }

  public insertDayStartBalance(
    data: { user: string; balance_start: number; date: Date }[],
  ): Knex.QueryBuilder {
    const rows = data.map((row) => {
      return { ...row, date: this.knex.raw('?::date', row.date) };
    });

    return this.knex('accounting.account').insert(rows);
  }
}
