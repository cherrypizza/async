import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { KafkaService } from './kafka.service';
import { UserEvent, TaskEvent, AccountLogEvent } from './interfaces';

@Controller()
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  @EventPattern('users-stream')
  public async syncUser(event: UserEvent): Promise<void> {
    await this.kafkaService.syncUser(event);
  }

  @EventPattern('tasks-stream')
  public async syncTask(event: TaskEvent): Promise<void> {
    await this.kafkaService.syncTask(event);
  }

  @EventPattern('account-log-stream')
  public async syncAccountLog(event: AccountLogEvent): Promise<void> {
    await this.kafkaService.syncAccountLog(event);
  }
}
