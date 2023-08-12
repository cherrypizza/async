import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { KafkaController } from './kafka.controller';
import { KafkaService } from './kafka.service';
import { KafkaQueries } from './kafka.queries';
import { KnexModule } from '../knex';

@Module({
  imports: [
    KnexModule,
    ClientsModule.register([
      {
        name: 'TASKS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'tasks',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'tasks-consumer',
          },
        },
      },
    ]),
  ],
  providers: [KafkaService, KafkaQueries],
  controllers: [KafkaController],
})
export class KafkaModule {}
