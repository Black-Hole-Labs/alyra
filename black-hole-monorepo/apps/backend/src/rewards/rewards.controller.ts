import { Controller, Get, Param } from '@nestjs/common';
import { RewardsService } from './rewards.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('address/:address')
  async getRewards(@Param('address') address: string) {
    return await this.rewardsService.getRewardsByAddress(address);
  }

  @Get('claim/:address')
  async getClaimTransaction(@Param('address') address: string) {
    console.log('[API] /rewards/claim/:address', address);
    const result = await this.rewardsService.getClaimTransaction(address);
    console.log('[API] /rewards/claim/:address result:', result);
    return result;
  }
} 