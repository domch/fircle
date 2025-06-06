import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { FirclesService } from './fircles.service';

@Controller('fircles')
export class FircleController {
  constructor(private readonly firclesService: FirclesService) {}

  @Post()
  create(@Body() body: any) {
    return this.firclesService.createFircle(body);
  }

  @Post(':id/invite')
  invite(@Param('id') id: string, @Body('email') email: string) {
    return this.firclesService.inviteMember(Number(id), email);
  }

  @Post(':id/accept')
  accept(@Param('id') id: string, @Body('userId') userId: number) {
    return this.firclesService.acceptInvite(Number(id), Number(userId));
  }

  @Get(':id/members')
  members(@Param('id') id: string) {
    return this.firclesService.getMembers(Number(id));
  }

  @Patch(':id/rules')
  updateRules(@Param('id') id: string, @Body('rules') rules: string) {
    return this.firclesService.updateRules(Number(id), rules);
  }
}
