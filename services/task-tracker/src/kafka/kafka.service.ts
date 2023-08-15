import { Injectable } from '@nestjs/common';

import { KafkaQueries } from './kafka.queries';
import { User } from '../interfaces';

@Injectable()
export class KafkaService {
  constructor(private readonly kafkaQueries: KafkaQueries) {}

  public syncUser(data: User): Promise<void> {
    const { public_id, login, role } = data;

    return this.kafkaQueries.createUser({ public_id, login, role });
  }
}
