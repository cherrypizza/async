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
        name: 'ACCOUNTING_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'accounting',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'accounting-consumer',
          },
        },
      },
    ]),
  ],
  providers: [KafkaService, KafkaQueries],
  controllers: [KafkaController],
})
export class KafkaModule {}
