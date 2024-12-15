import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { LifiService } from './lifi.service';

@Controller('lifi')
export class LifiController {
  constructor(private readonly lifiService: LifiService) {}

  @Get('chains')
  async getChains() {
    return await this.lifiService.getChains();
  }

  @Get('tools')
  async getTools() {
    return await this.lifiService.getTools();
  }

  @Get('tokens')
  async getTokens() {
    return await this.lifiService.getTokens();
  }

  @Get('quote')
  async getQuote(
    @Query('fromChain') fromChain: string,
    @Query('toChain') toChain: string,
    @Query('fromToken') fromToken: string,
    @Query('toToken') toToken: string,
    @Query('fromAmount') fromAmount: string,
    @Query('fromAddress') fromAddress: string,
  ) {
        if (!fromChain || !toChain || !fromToken || !toToken || !fromAmount || !fromAddress) {
          throw new HttpException('Missing required query parameters', HttpStatus.BAD_REQUEST);
        }
        const quote = await this.lifiService.getQuote(fromChain, toChain, fromToken, toToken, fromAmount, fromAddress);

        return quote;
    }
  
  @Get('quote-toamount')
  async getQuoteByReceivingAmount(
    @Query('fromChain') fromChain: string,
    @Query('toChain') toChain: string,
    @Query('fromToken') fromToken: string,
    @Query('toToken') toToken: string,
    @Query('toAmount') toAmount: string,
    @Query('fromAddress') fromAddress: string,
  ) {
        if (!fromChain || !toChain || !fromToken || !toToken || !toAmount || !fromAddress) {
          throw new HttpException('Missing required query parameters', HttpStatus.BAD_REQUEST);
        }
        const quote = await this.lifiService.getQuoteByReceivingAmount(fromChain, toChain, fromToken, toToken, toAmount, fromAddress);

        return quote;
    }

    @Get('status')
    async getStatus(@Query('txHash') txHash: string) {
      return await this.lifiService.getStatus(txHash);
    }

    // TODO: controller for executeTransaction()
}
