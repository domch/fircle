import { Controller, Get, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':userId')
  list(@Param('userId') userId: string) {
    return this.prisma.notification.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
    });
  }
}
