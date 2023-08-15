import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { KafkaService } from './kafka.service';
import { User } from '../interfaces';

@Controller()
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  @EventPattern('users_stream')
  public async syncUsers(data: User): Promise<void> {
    await this.kafkaService.syncUser(data);
  }
}
