import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountQueries } from './account.queries';
import { KnexModule } from '../knex';
import { AuthModule } from '../auth';

@Module({
  imports: [
    AuthModule,
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
          producerOnlyMode: true,
          consumer: {
            groupId: 'accounting-consumer',
          },
        },
      },
    ]),
  ],
  providers: [AccountService, AccountQueries],
  controllers: [AccountController],
})
export class AccountModule {}
