// Entities
export * from './entities/user.entity';
export * from './entities/user-referral.entity';
export * from './entities/reward-pool.entity';
export * from './entities/reward.entity';
export * from './entities/transaction.entity';
export * from './entities/token.entity';
export * from './entities/observer-state.entity';

// Repositories
export * from './repositories/user.repository';
export * from './repositories/user-referral.repository';
export * from './repositories/reward-pool.repository';
export * from './repositories/reward.repository';
export * from './repositories/transaction.repository';
export * from './repositories/observer-state.repository';

// Interfaces
export * from './interfaces/referral.interface';

// DTOs
export * from './dto/referral.dto';

// Module
export * from './core-db.module';

// Backward compatibility exports
export { ITransaction as IRewardTransaction } from './entities/transaction.entity';
export { TransactionEntity as RewardTransactionEntity } from './entities/transaction.entity';
export { TransactionRepository as RewardTransactionRepository } from './repositories/transaction.repository';

// Create proper IReferral interface for frontend compatibility
export interface IReferral {
  id: number;
  referrerCode: string;
  referrerAddress: string;
  chainId: number;
  createdAt: Date;
} 