import { Injectable } from '@nestjs/common';

import { Task, CreateTaskDto, CloseTaskDto } from './interfaces';
import { TasksQueries } from './tasks.queries';
import { User } from '../interfaces';

@Injectable()
export class TasksService {
  constructor(private readonly queries: TasksQueries) {}

  public async getTasks(user: User): Promise<Task[]> {
    return this.queries.getTasks(user.public_id);
  }

  public async createTask(data: CreateTaskDto): Promise<Task> {
    const executor = await this.selectExecutor();

    return this.queries.createTask({
      description: data.description,
      executor,
      price1: this.generateAssignmentPrice(),
      price2: this.generateClosingPrice(),
      isClosed: false,
    });
  }

  public async closeTask(data: CloseTaskDto): Promise<Task> {
    return this.queries.closeTask(data.id);
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

    return this.queries.reassignTasks(data);
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
}
