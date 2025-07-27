import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserEntity } from './entities/user.entity';
import { UserReferralEntity } from './entities/user-referral.entity';
import { RewardPoolEntity } from './entities/reward-pool.entity';
import { RewardEntity } from './entities/reward.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { TokenEntity } from './entities/token.entity';
import { ObserverStateEntity } from './entities/observer-state.entity';
import { UserRepository } from './repositories/user.repository';
import { UserReferralRepository } from './repositories/user-referral.repository';
import { RewardPoolRepository } from './repositories/reward-pool.repository';
import { RewardRepository } from './repositories/reward.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { ObserverStateRepository } from './repositories/observer-state.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'black_hole'),
        entities: [
          UserEntity,
          UserReferralEntity,
          RewardPoolEntity,
          RewardEntity,
          TransactionEntity,
          TokenEntity,
          ObserverStateEntity,
        ],
        synchronize: true, // Временно включить для создания всех таблиц
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      UserReferralEntity,
      RewardPoolEntity,
      RewardEntity,
      TransactionEntity,
      TokenEntity,
      ObserverStateEntity,
    ]),
  ],
  providers: [
    UserRepository,
    UserReferralRepository,
    RewardPoolRepository,
    RewardRepository,
    TransactionRepository,
    ObserverStateRepository,
  ],
  exports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserReferralEntity,
      RewardPoolEntity,
      RewardEntity,
      TransactionEntity,
      TokenEntity,
      ObserverStateEntity,
    ]),
    UserRepository,
    UserReferralRepository,
    RewardPoolRepository,
    RewardRepository,
    TransactionRepository,
    ObserverStateRepository,
  ],
})
export class CoreDbModule {} 