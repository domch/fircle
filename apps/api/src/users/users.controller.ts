import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { GTC_VERSION } from '../gtc/version';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getProfile(Number(id));
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updateProfile(Number(id), body);
  }

  @Post(':id/accept-gtc')
  acceptGtc(@Param('id') id: string) {
    return this.usersService.acceptGtc(Number(id), GTC_VERSION);
  }
}
