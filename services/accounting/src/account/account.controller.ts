import { Controller, UseGuards, Get, Req, Post } from '@nestjs/common';
import { Request } from 'express';

import { AccountService } from './account.service';
import { AuthGuard, Roles, RolesGuard } from '../auth';
import { ROLE } from '../constants';
import { User } from '../interfaces';

@UseGuards(AuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Roles(ROLE.Admin, ROLE.Manager)
  @UseGuards(RolesGuard)
  @Get('general')
  public async getGeneral() {
    return this.accountService.getGeneral();
  }

  @Get('')
  public async getPersonal(@Req() request: Request & { user: User }) {
    const { user } = request;

    return this.accountService.getPersonal(user);
  }

  @Post('')
  public async closeDay() {
    return this.accountService.closeDay();
  }
}
