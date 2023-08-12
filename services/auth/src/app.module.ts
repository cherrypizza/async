import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth';
import { UsersModule } from './users';
import { KnexModule } from './knex';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, KnexModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
