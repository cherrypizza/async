import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { v4 } from 'uuid';

import { KafkaQueries } from './kafka.queries';
import { validateEvent } from '../helper';
import { UserEvent, TaskEvent, AccountingEvent } from './interfaces';
import { AccountLog } from '../interfaces';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('ACCOUNTING_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly kafkaQueries: KafkaQueries,
  ) {}

  public async syncUser(event: UserEvent): Promise<void> {
    const { data } = event;

    if (validateEvent(event, 'user.created', 2)) {
      await Promise.all([
        this.kafkaQueries.createUser(data),
        this.kafkaQueries.createAccount({ user: data.public_id }),
      ]);
    } else {
      throw new Error(`not valid: ${JSON.stringify(event)}`);
    }
  }

  public async syncTask(event: TaskEvent): Promise<void> {
    if (validateEvent(event, 'task.created', 1)) {
      await this.kafkaQueries.createTask(event.data);
    } else {
      throw new Error(`not valid: ${JSON.stringify(event)}`);
    }
  }

  public async onTaskAssigned(event: AccountingEvent): Promise<void> {
    const {
      event_date,
      data: { user, task, price },
    } = event;

    if (validateEvent(event, 'task.assigned', 1)) {
      const [log] = await this.kafkaQueries.moneyDown({
        task,
        user,
        created: event_date,
        price,
      });

      this.emitAccountLogChanged(log);
    } else {
      throw new Error(`not valid: ${JSON.stringify(event)}`);
    }
  }

  public async onTaskClosed(event: AccountingEvent): Promise<void> {
    const {
      event_date,
      data: { user, task },
    } = event;

    if (validateEvent(event, 'task.closed', 1)) {
      const {
        rows: [log],
      } = await this.kafkaQueries.moneyUp({
        task,
        user,
        date: event_date,
      });

      this.emitAccountLogChanged(log);
    } else {
      throw new Error(`not valid: ${JSON.stringify(event)}`);
    }
  }

  private async emitAccountLogChanged(log: AccountLog): Promise<void> {
    const cudEventData = {
      event_id: v4(),
      producer: 'accounting-service',
      event_name: 'accountLogChanged',
      data: {
        public_id: log.public_id,
        user: log.user,
        task: log.task,
        created: log.created.toISOString(),
        price: log.price,
      },
    };

    if (validateEvent(cudEventData, 'account.log.changed', 1)) {
      this.kafkaClient.emit('account-log-stream', cudEventData);
    } else {
      throw new Error(`not valid: ${JSON.stringify(cudEventData)}`);
    }
  }
}
