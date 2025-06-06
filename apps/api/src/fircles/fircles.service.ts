import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FirclesService {
  constructor(private readonly prisma: PrismaService) {}

  createFircle(data: any) {
    return this.prisma.fircle.create({ data });
  }

  async inviteMember(fircleId: number, email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');
    return this.prisma.fircle.update({
      where: { id: fircleId },
      data: { members: { connect: { id: user.id } } },
    });
  }

  acceptInvite(fircleId: number, userId: number) {
    return this.prisma.fircle.update({
      where: { id: fircleId },
      data: { members: { connect: { id: userId } } },
    });
  }

  getMembers(fircleId: number) {
    return this.prisma.fircle.findUnique({
      where: { id: fircleId },
      select: { members: true },
    });
  }

  updateRules(fircleId: number, rules: string) {
    return this.prisma.fircle.update({
      where: { id: fircleId },
      data: { rules },
    });
  }
}
