import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersQueries } from './users.queries';
import { KnexModule } from '../knex';

@Module({
  imports: [
    KnexModule,
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true,
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersQueries],
  exports: [UsersService],
})
export class UsersModule {}
