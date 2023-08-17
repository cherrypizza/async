import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { KnexModule } from './knex';
import { KafkaModule } from './kafka';
import { AuthModule } from './auth';
import { AccountModule } from './account';

@Module({
  imports: [
    ConfigModule.forRoot(),
    KafkaModule,
    KnexModule,
    AuthModule,
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
