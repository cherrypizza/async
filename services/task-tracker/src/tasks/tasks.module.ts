import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { KnexModule } from '../knex';
import { TasksQueries } from './tasks.queries';
import { AuthModule } from '../auth';

@Module({
  imports: [ConfigModule.forRoot(), KnexModule, AuthModule],
  controllers: [TasksController],
  providers: [TasksService, TasksQueries],
})
export class TasksModule {}
