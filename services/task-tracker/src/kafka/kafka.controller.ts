import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { KafkaService } from './kafka.service';
import { EventData } from './interfaces';

@Controller()
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  @EventPattern('users-stream')
  public async syncUsers(event: EventData): Promise<void> {
    await this.kafkaService.syncUser(event);
  }
}
