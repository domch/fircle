jest.mock('@prisma/client', () => ({
  FircleState: { ACTIVE: 'ACTIVE', ABANDONED: 'ABANDONED' },
}));
jest.mock('../prisma.service', () => ({ PrismaService: class {} }));

import { MaintenanceService } from './maintenance.service';
import type { PrismaService } from '../prisma.service';
import { AuctionsService } from '../auctions/auctions.service';

describe('MaintenanceService', () => {
  let service: MaintenanceService;
  let prisma: any;
  let auctions: any;

  beforeEach(() => {
    prisma = {
      fircle: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
    } as unknown as PrismaService;
    auctions = { startAuction: jest.fn() } as unknown as AuctionsService;
    service = new MaintenanceService(prisma, auctions);
    jest.spyOn(service['logger'], 'log').mockImplementation(() => {});
  });

  it('marks abandoned fircles and starts auctions', async () => {
    prisma.fircle.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    prisma.fircle.update.mockResolvedValue({});
    await service.handleAbandonedFircles();
    expect(prisma.fircle.findMany).toHaveBeenCalled();
    expect(prisma.fircle.update).toHaveBeenCalledTimes(2);
    expect(auctions.startAuction).toHaveBeenCalledWith({ fircleId: 1 });
    expect(auctions.startAuction).toHaveBeenCalledWith({ fircleId: 2 });
  });
});
