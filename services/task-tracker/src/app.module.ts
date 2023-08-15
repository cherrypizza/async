import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TasksModule } from './tasks';
import { KnexModule } from './knex';
import { KafkaModule } from './kafka';
import { AuthModule } from './auth';

@Module({
  imports: [
    ConfigModule.forRoot(),
    KafkaModule,
    KnexModule,
    TasksModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
