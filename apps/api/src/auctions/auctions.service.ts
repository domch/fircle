import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuctionsService {
  constructor(private readonly prisma: PrismaService) {}

  startAuction(data: any) {
    return this.prisma.auction.create({ data });
  }

  bid(auctionId: number, bidderId: number, amount: number) {
    return this.prisma.bid.create({
      data: { auctionId, bidderId, amount },
    });
  }

  async closeAuction(id: number) {
    const bids = await this.prisma.bid.findMany({
      where: { auctionId: id },
      orderBy: { amount: 'desc' },
      take: 1,
    });
    const winningBid = bids[0];
    return this.prisma.auction.update({
      where: { id },
      data: { winningBidId: winningBid?.id },
    });
  }
}
