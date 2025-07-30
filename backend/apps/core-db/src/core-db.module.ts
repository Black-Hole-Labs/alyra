import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserEntity } from './entities/user.entity';
import { UserReferralEntity } from './entities/user-referral.entity';
import { RewardPoolEntity } from './entities/reward-pool.entity';
import { RewardEntity } from './entities/reward.entity';
import { RewardStateEntity } from './entities/reward-state.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { TokenEntity } from './entities/token.entity';
import { TransactionStateEntity } from './entities/transaction-state.entity';
import { UserRepository } from './repositories/user.repository';
import { UserReferralRepository } from './repositories/user-referral.repository';
import { RewardPoolRepository } from './repositories/reward-pool.repository';
import { RewardRepository } from './repositories/reward.repository';
import { RewardStateRepository } from './repositories/reward-state.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionStateRepository } from './repositories/transaction-state.repository';
import { MigrationService } from './migration.service';
import { MigrationHook } from './migration.hook';

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
          RewardStateEntity,
          TransactionEntity,
          TokenEntity,
          TransactionStateEntity,
        ],
        synchronize: true,
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
      RewardStateEntity,
      TransactionEntity,
      TokenEntity,
      TransactionStateEntity,
    ]),
  ],
  providers: [
    UserRepository,
    UserReferralRepository,
    RewardPoolRepository,
    RewardRepository,
    RewardStateRepository,
    TransactionRepository,
    TransactionStateRepository,
    MigrationService,
    MigrationHook,
  ],
  exports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserReferralEntity,
      RewardPoolEntity,
      RewardEntity,
      RewardStateEntity,
      TransactionEntity,
      TokenEntity,
      TransactionStateEntity,
    ]),
    UserRepository,
    UserReferralRepository,
    RewardPoolRepository,
    RewardRepository,
    RewardStateRepository,
    TransactionRepository,
    TransactionStateRepository,
    MigrationService,
    MigrationHook,
  ],
})
export class CoreDbModule {} 