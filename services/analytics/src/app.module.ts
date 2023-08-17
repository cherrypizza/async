import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { KnexModule } from './knex';
import { KafkaModule } from './kafka';
import { AuthModule } from './auth';
import { AnalyticModule } from './analytic';

@Module({
  imports: [
    ConfigModule.forRoot(),
    KafkaModule,
    KnexModule,
    AuthModule,
    AnalyticModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
