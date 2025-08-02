import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { join } from 'path';
import { UserEntity } from './entities/user.entity';
import { UserReferralEntity } from './entities/user-referral.entity';
import { RewardPoolEntity } from './entities/reward-pool.entity';
import { RewardEntity } from './entities/reward.entity';
import { RewardStateEntity } from './entities/reward-state.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { TokenEntity } from './entities/token.entity';
import { TransactionStateEntity } from './entities/transaction-state.entity';

// Загружаем переменные окружения
config({ path: '.env' });

// Используем абсолютный путь к миграциям
const migrationsPath = join(__dirname, 'migrations', '*.ts');

export const MigrationDataSource = new DataSource({
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
  migrations: [migrationsPath],
  migrationsTableName: 'migrations',
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});