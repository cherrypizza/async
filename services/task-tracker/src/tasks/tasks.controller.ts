import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';

import { AuthGuard, Roles, RolesGuard } from '../auth';
import { TasksService } from './tasks.service';

import { Task, CreateTaskDto, CloseTaskDto } from './interfaces';
import { ROLE } from '../constants';
import { User } from '../interfaces';

@UseGuards(AuthGuard)
@Controller('task')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public async getTasks(
    @Req() request: Request & { user: User },
  ): Promise<Task[]> {
    const { user } = request;

    return this.tasksService.getTasks(user);
  }

  @Post('create')
  public async createTask(@Body() taskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(taskDto);
  }

  @Post('close')
  public async closeTask(@Body() taskDto: CloseTaskDto): Promise<Task> {
    return this.tasksService.closeTask(taskDto);
  }

  @Roles(ROLE.Admin, ROLE.Manager)
  @UseGuards(RolesGuard)
  @Post('reassign')
  public async reassignTasks(): Promise<void> {
    return this.tasksService.reassignTasks();
  }
}
