import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { v4 } from 'uuid';

import { AccountQueries } from './account.queries';
import { User } from '../interfaces';
import { validateEvent } from '../helper';

@Injectable()
export class AccountService {
  constructor(
    @Inject('ACCOUNTING_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly accountQueries: AccountQueries,
  ) {}

  public async getGeneral() {
    const currentDate = this.getCurrentDay();

    return this.accountQueries.getLog(currentDate);
  }

  public async getPersonal(user: User) {
    const currentDate = this.getCurrentDay();

    const [[account], log] = await Promise.all([
      this.accountQueries.getAccount(user.public_id, currentDate),
      this.accountQueries.getUserLog(user.public_id, currentDate),
    ]);

    return {
      balanceStart: account.balance_start,
      balanceEnd: account.balance_end,
      pay: account.pay,
      log,
    };
  }

  public async closeDay(): Promise<void> {
    const currentDate = this.getCurrentDay();

    const updatedAccounts = await this.accountQueries.updateDayEndBalance(
      currentDate,
    );

    const lastDay = currentDate;
    lastDay.setDate(currentDate.getDate() + 1);

    const newBalanceData = updatedAccounts.map(
      ({ user, balance_end: balanceEnd }) => {
        return {
          user,
          balance_start: balanceEnd < 0 ? balanceEnd : 0,
          date: lastDay,
        };
      },
    );

    await this.accountQueries.insertDayStartBalance(newBalanceData);

    updatedAccounts.forEach((account) => {
      const eventData = {
        event_id: v4(),
        producer: 'accounting_service',
        event_name: 'accountChanged',
        data: {
          public_id: account.public_id,
          user: account.user,
          date: account.date.toISOString(),
          balance_start: account.balance_start,
          balance_end: account.balance_end,
          pay: account.pay,
        },
      };

      if (validateEvent(eventData, 'account.changed', 1)) {
        this.kafkaClient.emit('account-stream', eventData);
      } else {
        throw new Error(`not valid: ${JSON.stringify(eventData)}`);
      }
    });
  }

  private getCurrentDay(): Date {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return currentDate;
  }
}
