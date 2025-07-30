import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RewardEntity, UserReferralRepository, TransactionRepository, RewardStateRepository } from '@black-hole/core-db';
import { BLACKHOLE_FEE_PERCENTAGE, REWARD_FEE_PERCENTAGE } from '@black-hole/config';

@Injectable()
export class ReferralRewardDistributor {
  private readonly logger = new Logger(ReferralRewardDistributor.name);

  constructor(
    @InjectRepository(RewardEntity)
    private readonly rewardRepository: Repository<RewardEntity>,
    private readonly userReferralRepository: UserReferralRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly rewardStateRepository: RewardStateRepository,
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
        // Получаем адрес реферала из первого userReferral (все имеют одинаковый userId)
        const referrerAddress = userReferrals[0]?.user?.address;
        if (!referrerAddress) {
          this.logger.warn(`No valid referrer address found for userId ${userId}, skipping`);
          continue;
        }

        // Получаем или создаем состояние обработки для реферала
        const processingState = await this.rewardStateRepository.getOrCreate(referrerAddress);
        let maxTimestamp = processingState.lastProcessedTimestamp;
        
        this.logger.log(`Processing referrer ${referrerAddress} with lastProcessedTimestamp: ${processingState.lastProcessedTimestamp}`);

        for (const userReferral of userReferrals) {
          // Проверяем, что у нас есть данные пользователя
          if (!userReferral.user) {
            this.logger.warn(`User data not found for userReferral ${userReferral.id}, skipping`);
            continue;
          }

          this.logger.debug(`Processing invited user ${userReferral.userAddress} for referrer ${referrerAddress}`);

          // Находим транзакции приглашенного пользователя ПОСЛЕ последней обработанной
          const userTransactions = await this.transactionRepository.findByAddressAfterTimestamp(
            userReferral.userAddress,
            processingState.lastProcessedTimestamp
          );

          this.logger.debug(`Found ${userTransactions.length} new transactions for user ${userReferral.userAddress}`);

          // Обрабатываем новые транзакции
          for (const transaction of userTransactions) {
            // Дополнительная проверка - пропускаем транзакции с timestamp <= lastProcessedTimestamp
            if (transaction.timestamp <= processingState.lastProcessedTimestamp) {
              this.logger.debug(`Skipping transaction ${transaction.id} with timestamp ${transaction.timestamp} (already processed: ${processingState.lastProcessedTimestamp})`);
              continue;
            }

            // Проверяем, что у нас есть USD сумма и конвертируем в число
            if (!transaction.amountUSD) {
              this.logger.warn(`Transaction ${transaction.id} has no USD amount, skipping reward calculation`);
              continue;
            }

            // Конвертируем amountUSD в число (может быть строкой из-за decimal типа)
            const amountUSD = typeof transaction.amountUSD === 'string' 
              ? parseFloat(transaction.amountUSD) 
              : transaction.amountUSD;

            if (isNaN(amountUSD) || amountUSD <= 0) {
              this.logger.warn(`Transaction ${transaction.id} has invalid USD amount: ${transaction.amountUSD}, skipping`);
              continue;
            }
            
            // Сначала получаем комиссию Blackhole (0.15% от суммы транзакции)
            const blackholeFee = amountUSD * BLACKHOLE_FEE_PERCENTAGE;
            // Получаем процент награды из БД или используем дефолтный
            const rewardPercentage = userReferrals[0]?.user?.rewardPercentage || REWARD_FEE_PERCENTAGE;
            // Затем от этой комиссии берем процент для ревардов
            const referralRewardAmount = blackholeFee * rewardPercentage;

            // Создаем награду для реферала
            await this.rewardRepository.save({
              rewardPoolId: 1, // rewardPoolId = 1 (manually set in DB)
              amount: referralRewardAmount,
              address: referrerAddress, // Address of the referrer
            });
            
            this.logger.log(`Referral reward created: $${referralRewardAmount.toFixed(2)} USD for referrer ${referrerAddress} from transaction ${transaction.id} (transaction: $${amountUSD.toFixed(2)} USD, Blackhole fee: $${blackholeFee.toFixed(2)} USD, reward percentage: ${(rewardPercentage * 100).toFixed(1)}%)`);

            // Обновляем максимальный timestamp
            maxTimestamp = Math.max(maxTimestamp, transaction.timestamp);
          }
        }

        // Обновляем состояние обработки для реферала в целом
        if (maxTimestamp > processingState.lastProcessedTimestamp) {
          await this.rewardStateRepository.updateByReferrerAddress(referrerAddress, {
            lastProcessedTimestamp: maxTimestamp
          });
          this.logger.log(`Updated processing state for referrer ${referrerAddress}: lastProcessedTimestamp = ${maxTimestamp}`);
        } else {
          this.logger.debug(`No new transactions processed for referrer ${referrerAddress}, lastProcessedTimestamp remains: ${processingState.lastProcessedTimestamp}`);
        }
      }
    } catch (error) {
      this.logger.error('Error distributing referral rewards:', error);
    }
  }
} 