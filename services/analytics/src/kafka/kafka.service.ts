import { Injectable } from '@nestjs/common';

import { KafkaQueries } from './kafka.queries';
import { validateEvent } from '../helper';
import {
  UserEvent,
  TaskEvent,
  AccountLogEvent,
  AccountEvent,
} from './interfaces';

@Injectable()
export class KafkaService {
  constructor(private readonly kafkaQueries: KafkaQueries) {}

  public async syncUser(event: UserEvent): Promise<void> {
    if (validateEvent(event, 'user.created', 2)) {
      await this.kafkaQueries.createUser(event.data);
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

  public async syncAccountLog(event: AccountLogEvent): Promise<void> {
    if (validateEvent(event, 'account.log.changed', 1)) {
      await this.kafkaQueries.addLog(event.data);
    } else {
      throw new Error(`not valid: ${JSON.stringify(event)}`);
    }
  }

  public async syncAccount(event: AccountEvent): Promise<void> {
    if (validateEvent(event, 'account.changed', 1)) {
      await this.kafkaQueries.upsertAccount(event.data);
    } else {
      throw new Error(`not valid: ${JSON.stringify(event)}`);
    }
  }
}
