import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';

@Injectable()
export class FircleRulesAcceptedMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const user = req.user;
    const fircleId = Number(req.params.id || req.body.fircleId);
    const accepted = Array.isArray(user?.acceptedFircleRules) &&
      user.acceptedFircleRules.includes(fircleId);
    if (!accepted) {
      throw new ForbiddenException('Fircle rules not accepted');
    }
    next();
  }
}
