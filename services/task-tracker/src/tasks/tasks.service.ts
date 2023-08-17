import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { v4 } from 'uuid';

import { Task, CreateTaskDto, CloseTaskDto } from './interfaces';
import { TasksQueries } from './tasks.queries';
import { User } from '../interfaces';
import { validateEvent } from '../helper';

const PRODUCER = 'tasks_service';

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASKS_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly queries: TasksQueries,
  ) {}

  public async getTasks(user: User): Promise<Task[]> {
    return this.queries.getTasks(user.public_id);
  }

  public async createTask(data: CreateTaskDto): Promise<Task> {
    const description = this.getDescription(data.description);

    const executor = await this.selectExecutor();

    const [task] = await this.queries.createTask({
      description: description,
      executor,
      price1: this.generateAssignmentPrice(),
      price2: this.generateClosingPrice(),
      isClosed: false,
    });

    const cudEventData = {
      event_id: v4(),
      producer: PRODUCER,
      event_name: 'taskCreated',
      data: {
        public_id: task.public_id,
        description: task.description,
        price1: task.price1,
        price2: task.price2,
      },
    };

    if (validateEvent(cudEventData, 'task.created', 1)) {
      this.kafkaClient.emit('tasks-stream', cudEventData);
    } else {
      throw new Error(`not valid: ${JSON.stringify(cudEventData)}`);
    }

    this.emitTaskAssigned(task.public_id, task.executor, task.price1);

    return task;
  }

  public async closeTask(data: CloseTaskDto): Promise<Task> {
    const [task] = await this.queries.closeTask(data.id);
    const eventData = {
      event_id: v4(),
      producer: PRODUCER,
      event_name: 'taskClosed',
      event_date: new Date().toISOString(),
      data: {
        task: task.public_id,
        user: task.executor,
      },
    };

    if (validateEvent(eventData, 'task.closed', 1)) {
      this.kafkaClient.emit('task_closed', eventData);
    } else {
      throw new Error(`not valid: ${JSON.stringify(eventData)}`);
    }

    return task;
  }

  public async reassignTasks(): Promise<void> {
    const [tasks, users] = await Promise.all([
      this.queries.getOpenTasks(),
      this.queries.getWorkers(),
    ]);

    const data = tasks.reduce((acc, { id }) => {
      const index = this.getRandomInInterval(0, users.length - 1);
      acc.push({ id, executor: users[index]['public_id'] });

      return acc;
    }, []);

    const changedTasks = await this.queries.reassignTasks(data);

    changedTasks.forEach(({ public_id, executor, price1 }) => {
      this.emitTaskAssigned(public_id, executor, price1);
    });
  }

  private async selectExecutor(): Promise<string> {
    const user = await this.queries.getRandomUser();

    if (!user) {
      throw new Error('Popug not found');
    }

    return user.public_id;
  }

  private getRandomInInterval(start: number, end: number): number {
    const min = Math.ceil(start);
    const max = Math.floor(end);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateAssignmentPrice(): number {
    return this.getRandomInInterval(-20, -10);
  }

  private generateClosingPrice(): number {
    return this.getRandomInInterval(20, 40);
  }

  private emitTaskAssigned(task: string, user: string, price: string): void {
    const eventData = {
      event_id: v4(),
      producer: PRODUCER,
      event_name: 'taskAssigned',
      event_date: new Date().toISOString(),
      data: {
        task,
        user,
        price,
      },
    };

    if (validateEvent(eventData, 'task.assigned', 1)) {
      this.kafkaClient.emit('task_assigned', eventData);
    } else {
      throw new Error(`not valid: ${JSON.stringify(eventData)}`);
    }
  }

  private getDescription(text: string): string {
    if (text.startsWith('[')) {
      const index = text.indexOf('] -');
      return text.substring(index + 1);
    }

    return text;
  }
}
