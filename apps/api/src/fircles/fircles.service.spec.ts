jest.mock('../prisma.service', () => ({ PrismaService: class {} }));

import { FirclesService } from './fircles.service';
import type { PrismaService } from '../prisma.service';

describe('FirclesService', () => {
  let service: FirclesService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      fircle: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    } as unknown as PrismaService;
    service = new FirclesService(prisma);
  });

  it('should create a fircle', async () => {
    prisma.fircle.create.mockResolvedValue({ id: 1 });
    const result = await service.createFircle({ name: 'Test' });
    expect(prisma.fircle.create).toHaveBeenCalledWith({ data: { name: 'Test' } });
    expect(result).toEqual({ id: 1 });
  });

  describe('inviteMember', () => {
    it('invites an existing user', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 2 });
      prisma.fircle.update.mockResolvedValue({ id: 1 });
      const result = await service.inviteMember(1, 'test@example.com');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(prisma.fircle.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { members: { connect: { id: 2 } } },
      });
      expect(result).toEqual({ id: 1 });
    });

    it('throws when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.inviteMember(1, 'missing@example.com')).rejects.toThrow('User not found');
    });
  });

  it('accepts an invite', async () => {
    prisma.fircle.update.mockResolvedValue({ id: 1 });
    const result = await service.acceptInvite(1, 3);
    expect(prisma.fircle.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { members: { connect: { id: 3 } } },
    });
    expect(result).toEqual({ id: 1 });
  });

  it('updates fircle rules', async () => {
    prisma.fircle.update.mockResolvedValue({ id: 1, rules: 'new' });
    const result = await service.updateRules(1, 'new');
    expect(prisma.fircle.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { rules: 'new' },
    });
    expect(result).toEqual({ id: 1, rules: 'new' });
  });
});
