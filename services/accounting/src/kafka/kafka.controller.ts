import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { KafkaService } from './kafka.service';
import { UserEvent, TaskEvent, AccountingEvent } from './interfaces';

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

  @EventPattern('task_assigned')
  public async onTaskAssigned(event: AccountingEvent): Promise<void> {
    await this.kafkaService.onTaskAssigned(event);
  }

  @EventPattern('task_closed')
  public async onTaskClosed(event: AccountingEvent): Promise<void> {
    await this.kafkaService.onTaskClosed(event);
  }
}
