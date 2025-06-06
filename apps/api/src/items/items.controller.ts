import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  add(@Body() body: any) {
    return this.itemsService.addItem(body);
  }

  @Patch(':id')
  edit(@Param('id') id: string, @Body() body: any) {
    return this.itemsService.editItem(Number(id), body);
  }

  @Get('/fircle/:id')
  list(@Param('id') id: string) {
    return this.itemsService.listInFircle(Number(id));
  }

  @Post(':id/request-lend')
  requestLend(
    @Param('id') id: string,
    @Body('requestedBy') requestedBy: number,
    @Body('offerType') offerType: string,
  ) {
    return this.itemsService.requestLending(
      Number(id),
      Number(requestedBy),
      offerType,
    );
  }

  @Post(':id/sub-lend')
  subLend(@Param('id') id: string, @Body('userId') userId: number) {
    return this.itemsService.subLend(Number(id), Number(userId));
  }

  @Get(':id/ownership')
  ownership(@Param('id') id: string) {
    return this.itemsService.ownershipChain(Number(id));
  }
}
