import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CoreDbModule } from '@black-hole/core-db';
import { LifiTransactionObserver } from './lifi-transaction.observer';
import { ReferralRewardDistributor } from './referral-reward-distributor';

@Module({
  imports: [ScheduleModule.forRoot(), CoreDbModule],
  controllers: [],
  providers: [
    LifiTransactionObserver,
    ReferralRewardDistributor
  ],
})
export class AppModule {} 