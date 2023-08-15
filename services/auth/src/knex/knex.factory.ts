import { KnexConfigProvider } from './knex.config';
import { knex, Knex } from 'knex';

export const KnexFactory = {
  inject: [KnexConfigProvider],
  provide: 'Knex',
  useFactory: (configProvider: KnexConfigProvider): Knex => {
    const db = knex(configProvider.getKnexConfig());

    return db;
  },
};
