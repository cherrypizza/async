import { Module } from '@nestjs/common';

import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';
import { AnalyticQueries } from './analytic.queries';
import { KnexModule } from '../knex';
import { AuthModule } from '../auth';

@Module({
  imports: [KnexModule, AuthModule],
  providers: [AnalyticService, AnalyticQueries],
  controllers: [AnalyticController],
})
export class AnalyticModule {}
