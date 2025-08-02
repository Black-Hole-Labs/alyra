import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserEntity } from './apps/core-db/src/entities/user.entity';
import { UserReferralEntity } from './apps/core-db/src/entities/user-referral.entity';
import { RewardPoolEntity } from './apps/core-db/src/entities/reward-pool.entity';
import { RewardEntity } from './apps/core-db/src/entities/reward.entity';
import { RewardStateEntity } from './apps/core-db/src/entities/reward-state.entity';
import { TransactionEntity } from './apps/core-db/src/entities/transaction.entity';
import { TokenEntity } from './apps/core-db/src/entities/token.entity';
import { TransactionStateEntity } from './apps/core-db/src/entities/transaction-state.entity';

// Загружаем переменные окружения
config({ path: '.env' });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'black_hole',
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
  migrations: ['apps/core-db/src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false, // В продакшене всегда false
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Добавляем настройки для TypeScript
  migrationsRun: false,
}); 