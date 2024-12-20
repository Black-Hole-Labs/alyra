import { Controller, Get } from '@nestjs/common';
import { LifiTenderlyService } from './lifi-tenderly.service';

@Controller('lifi-tenderly')
export class LifiTenderlyController {
  constructor(private readonly lifitenderlyService: LifiTenderlyService) {}

  @Get('test')
  async testLifiTenderly() {
    return await this.lifitenderlyService.runExample();
  }
}
