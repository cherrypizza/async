import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

import { User, UserDto } from './interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Post('create')
  public async createUser(@Body() userDto: UserDto): Promise<User> {
    return this.usersService.createUser(userDto);
  }
}
