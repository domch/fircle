import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getProfile(userId: number) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  updateProfile(userId: number, data: any) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }

  acceptGtc(userId: number, version: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        acceptedGTC: true,
        gtcVersion: version,
        gtcAcceptedAt: new Date(),
      },
    });
  }
}
