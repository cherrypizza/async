import { Injectable } from '@nestjs/common';

import { KafkaQueries } from './kafka.queries';
import { validateEvent } from '../helper';
import { EventData } from './interfaces';

const EVENT = 'user.created';
const EVENT_VERSION = 2;

@Injectable()
export class KafkaService {
  constructor(private readonly kafkaQueries: KafkaQueries) {}

  public async syncUser(event: EventData): Promise<void> {
    if (validateEvent(event, EVENT, EVENT_VERSION)) {
      await this.kafkaQueries.createUser(event.data);
    }
  }
}
