import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LifiService } from './lifi.service';

@Controller('lifi')
export class LifiController {
  constructor(private readonly lifiService: LifiService) {}

  @Get('get-chains')
  async getChains() {
    return await this.lifiService.getChains();
  }

  @Get('get-tools')
  async getTools() {
    return await this.lifiService.getTools();
  }

  @Get('get-tokens')
  async getTokens() {
    return await this.lifiService.getTokens();
  }
}
