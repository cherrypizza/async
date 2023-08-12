import { Inject, Injectable, Optional } from '@nestjs/common';

export interface KnexConfig {
  app?: string;
  knex?: {
    pool?: {
      min?: number;
      max?: number;
    };
  };
}

@Injectable()
export class KnexConfigProvider {
  constructor(
    @Optional() @Inject('Config') private readonly config?: KnexConfig,
  ) {}

  getKnexConfig() {
    return {
      client: 'pg',
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        ssl: false,
      },
    };
  }
}
