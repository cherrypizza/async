import { Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Knex } from 'knex';
import { KnexConfigProvider } from './knex.config';
import { KnexFactory } from './knex.factory';

@Module({
  exports: [KnexFactory],
  providers: [KnexFactory, KnexConfigProvider],
})
export class KnexModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown() {
    const knex = this.moduleRef.get<Knex>('Knex');
    await knex.destroy();
  }
}
