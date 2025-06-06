import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { FircleController } from './fircles/fircles.controller';
import { FirclesService } from './fircles/fircles.service';
import { ItemController } from './items/items.controller';
import { ItemsService } from './items/items.service';
import { AuctionController } from './auctions/auctions.controller';
import { AuctionsService } from './auctions/auctions.service';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    UserController,
    FircleController,
    ItemController,
    AuctionController,
    NotificationsController,
  ],
  providers: [
    AppService,
    AuthService,
    UsersService,
    FirclesService,
    ItemsService,
    AuctionsService,
    PrismaService,
    NotificationsService,
  ],
})
export class AppModule {}
