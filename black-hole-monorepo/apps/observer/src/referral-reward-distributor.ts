import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RewardEntity } from '@black-hole/core-db';
import { UserReferralRepository } from '@black-hole/core-db';
import { TransactionRepository } from '@black-hole/core-db';
import { BLACKHOLE_FEE_PERCENTAGE, REWARD_FEE_PERCENTAGE } from '@black-hole/config';

@Injectable()
export class ReferralRewardDistributor {
  private readonly logger = new Logger(ReferralRewardDistributor.name);

  constructor(
    @InjectRepository(RewardEntity)
    private readonly rewardRepository: Repository<RewardEntity>,
    private readonly userReferralRepository: UserReferralRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async distributeReferralRewards(): Promise<void> {
    this.logger.log('Starting referral rewards distribution...');

    try {
      // Получаем все user_referrals с подгруженными user
      const allUserReferrals = await this.userReferralRepository.findAllWithUsers();
      // Группируем по userId
      const usersMap = new Map<number, typeof allUserReferrals>();
      for (const userReferral of allUserReferrals) {
        if (!usersMap.has(userReferral.userId)) {
          usersMap.set(userReferral.userId, []);
        }
        usersMap.get(userReferral.userId)!.push(userReferral);
      }

      for (const [userId, userReferrals] of usersMap.entries()) {
        for (const userReferral of userReferrals) {
          // Проверяем, что у нас есть данные пользователя
          if (!userReferral.user) {
            this.logger.warn(`User data not found for userReferral ${userReferral.id}, skipping`);
            continue;
          }

          // Находим все транзакции пользователя
          const userTransactions = await this.transactionRepository.findByAddress(userReferral.userAddress);

          // Для каждой транзакции создаем награду рефералу
          for (const transaction of userTransactions) {
            // Проверяем, не создали ли мы уже награду для этой транзакции и реферала
            const existingReward = await this.rewardRepository.findOne({
              where: {
                address: userReferral.user.address, // Address of the referrer
                rewardPoolId: 1, // rewardPoolId = 1 (manually set in DB)
                // Убираем claimHash так как поле удалено
              },
            });

            if (existingReward) {
              this.logger.debug(`Referral reward already exists for transaction ${transaction.id} and referrer ${userReferral.user.address}`);
              continue;
            }

            // Рассчитываем реферальную награду (40% от комиссии Blackhole)
            if (!transaction.amountUSD) {
              this.logger.warn(`Transaction ${transaction.id} has no USD amount, skipping reward calculation`);
              continue;
            }
            
            // Сначала получаем комиссию Blackhole (0.15% от суммы транзакции)
            const blackholeFee = transaction.amountUSD * BLACKHOLE_FEE_PERCENTAGE;
            // Затем от этой комиссии берем 40% для ревардов
            const referralRewardAmount = blackholeFee * REWARD_FEE_PERCENTAGE;

            // Создаем награду для реферала
            await this.rewardRepository.save({
              rewardPoolId: 1, // rewardPoolId = 1 (manually set in DB)
              amount: referralRewardAmount,
              address: userReferral.user.address, // Address of the referrer
              // Убираем поля expiration, expired, claimed, claimHash, claimTimestamp
            });
            
            this.logger.log(`Referral reward created: $${referralRewardAmount.toFixed(2)} USD for referrer ${userReferral.user.address} from transaction ${transaction.id} (transaction: $${transaction.amountUSD.toFixed(2)} USD, Blackhole fee: $${blackholeFee.toFixed(2)} USD)`);
          }
        }
      }
    } catch (error) {
      this.logger.error('Error distributing referral rewards:', error);
    }
  }
} 