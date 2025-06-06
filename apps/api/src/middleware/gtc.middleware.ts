import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';

@Injectable()
export class GtcAcceptedMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const user = req.user;
    if (!user?.acceptedGTC) {
      throw new ForbiddenException('GTC not accepted');
    }
    next();
  }
}
