import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { RolesGuard } from './roles.guard';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: RolesGuard,
      useClass: RolesGuard,
    },
  ],
  exports: [HttpModule],
})
export class AuthModule {}
