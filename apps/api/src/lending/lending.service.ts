import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class LendingService {
  constructor(private readonly prisma: PrismaService) {}

  requestLend(itemId: number, requestedById: number, offerType: string) {
    return this.prisma.lendingRequest.create({
      data: { itemId, requestedById, offerType: offerType as any },
    });
  }

  async respondToRequest(requestId: number, accept: boolean) {
    const request = await this.prisma.lendingRequest.findUnique({
      where: { id: requestId },
    });
    if (!request) throw new Error('Request not found');

    if (!accept) {
      return this.prisma.lendingRequest.update({
        where: { id: requestId },
        data: { status: RequestStatus.REJECTED },
      });
    }

    await this.transferItem(request.itemId, request.requestedById);
    return this.prisma.lendingRequest.update({
      where: { id: requestId },
      data: { status: RequestStatus.ACCEPTED },
    });
  }

  async transferItem(itemId: number, newHolderId: number) {
    const item = await this.prisma.item.findUnique({ where: { id: itemId } });
    if (!item) throw new Error('Item not found');

    const now = new Date();
    const history: any[] = (item.ownershipHistory as any[]) || [];
    const previousEntry = history.length ? history[history.length - 1] : null;

    if (previousEntry && !previousEntry.end) {
      previousEntry.end = now;
      if (item.profitPercentage && item.price) {
        previousEntry.profit =
          item.price * (item.profitPercentage / 100);
      }
    }

    history.push({ userId: newHolderId, start: now });

    await this.prisma.ownershipChange.create({
      data: {
        itemId: item.id,
        fromUserId: item.currentHolderId || item.ownerId,
        toUserId: newHolderId,
        profitPercentage: item.profitPercentage,
      },
    });

    return this.prisma.item.update({
      where: { id: item.id },
      data: {
        currentHolderId: newHolderId,
        ownershipHistory: history,
      },
    });
  }

  ownershipLog(itemId: number) {
    return this.prisma.ownershipChange.findMany({
      where: { itemId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
