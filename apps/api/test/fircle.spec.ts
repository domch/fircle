import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as path from 'path';
process.env.DATABASE_URL = 'file:' + path.join(__dirname, '../prisma/test.db');
import * as request from 'supertest';
import { FircleController } from '../src/fircles/fircles.controller';
import { ItemController } from '../src/items/items.controller';
import { FirclesService } from '../src/fircles/fircles.service';
import { ItemsService } from '../src/items/items.service';
import { PrismaService } from '../src/prisma.service';
import { PrismaClient } from '../generated/test-client';

class TestPrismaService extends PrismaClient {}

describe('FircleController (e2e)', () => {
  let app: INestApplication;
  let prisma: TestPrismaService;

  beforeAll(async () => {
    const path = require('path');
    process.env.DATABASE_URL = 'file:' + path.join(__dirname, '../prisma/test.db');
    prisma = new TestPrismaService();
    await prisma.$connect();
    const module = await Test.createTestingModule({
      controllers: [FircleController, ItemController],
      providers: [
        FirclesService,
        ItemsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.lendingRequest.deleteMany();
    await prisma.item.deleteMany();
    await prisma.fircle.deleteMany();
    await prisma.user.deleteMany();
  });

  it('POST /fircles', async () => {
    const res = await request(app.getHttpServer())
      .post('/fircles')
      .send({ name: 'New Fircle' })
      .expect(201);
    expect(res.body).toMatchObject({ id: expect.any(Number), name: 'New Fircle' });
  });

  it('POST /fircles/:id/invite', async () => {
    const user = await prisma.user.create({ data: { email: 'a@b.com', name: 'A' } });
    const fircle = await prisma.fircle.create({ data: { name: 'Group1' } });

    await request(app.getHttpServer())
      .post(`/fircles/${fircle.id}/invite`)
      .send({ email: user.email })
      .expect(201);

    const updated = await prisma.fircle.findUnique({ where: { id: fircle.id }, include: { members: true } });
    expect(updated?.members.map(m => m.id)).toContain(user.id);
  });

  it('GET /fircles/:id/members', async () => {
    const user = await prisma.user.create({ data: { email: 'b@b.com', name: 'B' } });
    const fircle = await prisma.fircle.create({ data: { name: 'Group2', members: { connect: { id: user.id } } } });

    const res = await request(app.getHttpServer())
      .get(`/fircles/${fircle.id}/members`)
      .expect(200);
    expect(res.body).toEqual({ members: [{ id: user.id, email: user.email, name: user.name }] });
  });

  it('POST /items/:id/request-lend', async () => {
    const user = await prisma.user.create({ data: { email: 'c@b.com', name: 'C' } });
    const item = await prisma.item.create({ data: { name: 'Item1', ownerId: user.id } });

    const res = await request(app.getHttpServer())
      .post(`/items/${item.id}/request-lend`)
      .send({ requestedBy: user.id, offerType: 'LEND' })
      .expect(201);
    expect(res.body).toMatchObject({ itemId: item.id, requestedById: user.id, offerType: 'LEND' });
  });

  it('POST /fircles/:id/items returns 404', async () => {
    const fircle = await prisma.fircle.create({ data: { name: 'Group3' } });
    await request(app.getHttpServer())
      .post(`/fircles/${fircle.id}/items`)
      .send({ name: 'ItemX' })
      .expect(404);
  });
});
