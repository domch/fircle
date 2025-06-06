import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuctionsService } from './auctions.service';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post('start')
  start(@Body() body: any) {
    return this.auctionsService.startAuction(body);
  }

  @Post(':id/bid')
  bid(
    @Param('id') id: string,
    @Body('bidderId') bidderId: number,
    @Body('amount') amount: number,
  ) {
    return this.auctionsService.bid(Number(id), Number(bidderId), Number(amount));
  }

  @Post(':id/close')
  close(@Param('id') id: string) {
    return this.auctionsService.closeAuction(Number(id));
  }
}
