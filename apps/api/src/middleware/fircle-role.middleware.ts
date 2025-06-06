import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FircleRoleMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: any, res: any, next: () => void) {
    const user = req.user;
    const fircleId = Number(req.params.id || req.body.fircleId);
    if (!fircleId) {
      throw new ForbiddenException('Fircle id required');
    }

    const fircle = await this.prisma.fircle.findUnique({
      where: { id: fircleId },
      select: {
        ownerId: true,
        admins: { select: { id: true } },
        members: { select: { id: true } },
      },
    });
    if (!fircle) throw new ForbiddenException('Fircle not found');

    const isOwner = fircle.ownerId === user.id;
    const isAdmin = fircle.admins.some(a => a.id === user.id);
    const isMember = fircle.members.some(m => m.id === user.id);
    if (!isOwner && !isAdmin && !isMember) {
      throw new ForbiddenException('Access to fircle denied');
    }
    next();
  }
}
