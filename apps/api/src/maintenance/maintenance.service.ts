import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { AuctionsService } from '../auctions/auctions.service';
import { FircleState } from '@prisma/client';

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);
  private readonly inactiveDays = Number(process.env.FIRCLE_INACTIVE_DAYS ?? 30);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auctionsService: AuctionsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY)
  async handleAbandonedFircles() {
    const cutoff = new Date(Date.now() - this.inactiveDays * 24 * 60 * 60 * 1000);
    const fircles = await this.prisma.fircle.findMany({
      where: {
        state: FircleState.ACTIVE,
        updatedAt: { lt: cutoff },
        owner: { updatedAt: { lt: cutoff } },
      },
      select: { id: true },
    });

    for (const f of fircles) {
      await this.prisma.fircle.update({
        where: { id: f.id },
        data: { state: FircleState.ABANDONED },
      });
      await this.auctionsService.startAuction({ fircleId: f.id });
      this.logger.log(`Fircle ${f.id} marked abandoned and auction started`);
    }
  }
}
