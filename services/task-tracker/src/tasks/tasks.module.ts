import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { KnexModule } from '../knex';
import { TasksQueries } from './tasks.queries';
import { AuthModule } from '../auth';

@Module({
  imports: [
    ConfigModule.forRoot(),
    KnexModule,
    AuthModule,
    ClientsModule.register([
      {
        name: 'TASKS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'tasks',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true,
          consumer: {
            groupId: 'tasks-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksQueries],
})
export class TasksModule {}
