import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async oidcLogin(provider: 'google' | 'microsoft', token: string) {
    // In a real implementation you would verify the token with the provider
    const user = await this.prisma.user.findFirst({ where: { oidcSub: token } });
    if (!user) throw new Error('User not found');
    const accessToken = await this.jwtService.signAsync({ sub: user.id });
    return { provider, accessToken };
  }
}
