import { Injectable } from '@nestjs/common';

import { AnalyticQueries } from './analytic.queries';

@Injectable()
export class AnalyticService {
  constructor(private readonly analyticQueries: AnalyticQueries) {}

  public async getAnalytics() {
    const currentDate = new Date();

    const [dayTotal, minusUserCount, maxPrice] = await Promise.all([
      this.analyticQueries.getDayTotal(currentDate),
      this.analyticQueries.getMinusUserCount(currentDate),
      this.analyticQueries.getMaxPrice(currentDate),
    ]);

    return { dayTotal, minusUserCount, maxPrice };
  }
}
