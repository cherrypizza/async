import { Controller, UseGuards, Get } from '@nestjs/common';

import { AnalyticService } from './analytic.service';
import { AuthGuard, Roles, RolesGuard } from '../auth';
import { ROLE } from '../constants';

@UseGuards(AuthGuard)
@Controller('analytic')
export class AnalyticController {
  constructor(private readonly analyticService: AnalyticService) {}

  @Roles(ROLE.Admin, ROLE.Manager)
  @UseGuards(RolesGuard)
  @Get('')
  public async getAnalytics() {
    return this.analyticService.getAnalytics();
  }
}
