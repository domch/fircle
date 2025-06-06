import { Controller, Get } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { GTC_VERSION } from './version';

@Controller('gtc')
export class GtcController {
  private docPath = join(__dirname, '../../../GTC.md');

  @Get()
  getDocument() {
    const content = readFileSync(this.docPath, 'utf8');
    return { version: GTC_VERSION, content };
  }
}
