import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  addItem(data: any) {
    return this.prisma.item.create({ data });
  }

  editItem(id: number, data: any) {
    return this.prisma.item.update({ where: { id }, data });
  }

  listInFircle(fircleId: number) {
    return this.prisma.item.findMany({
      where: {
        owner: { memberOf: { some: { id: fircleId } } },
      },
    });
  }

  requestLending(itemId: number, requestedById: number, offerType: string) {
    return this.prisma.lendingRequest.create({
      data: { itemId, requestedById, offerType: offerType as any },
    });
  }

  async subLend(itemId: number, newHolderId: number) {
    const item = await this.prisma.item.update({
      where: { id: itemId },
      data: { currentHolderId: newHolderId },
    });
    return item;
  }

  async ownershipChain(itemId: number) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
      select: { ownershipHistory: true },
    });
    return item?.ownershipHistory || [];
  }
}
