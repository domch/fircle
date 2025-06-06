import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
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
import { AuthMiddleware } from './middleware/auth.middleware';
import { GtcAcceptedMiddleware } from './middleware/gtc.middleware';
import { FircleRoleMiddleware } from './middleware/fircle-role.middleware';
import { FircleRulesAcceptedMiddleware } from './middleware/fircle-rules.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: 'change-me',
      signOptions: { expiresIn: '1h' },
    }),
  ],
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
    AuthMiddleware,
    GtcAcceptedMiddleware,
    FircleRoleMiddleware,
    FircleRulesAcceptedMiddleware,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware, GtcAcceptedMiddleware).forRoutes('*');

    consumer
      .apply(FircleRoleMiddleware, FircleRulesAcceptedMiddleware)
      .forRoutes({ path: 'fircles/:id*', method: RequestMethod.ALL });
  }
}
