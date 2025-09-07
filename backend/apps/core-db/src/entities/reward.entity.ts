import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { RewardPoolEntity } from './reward-pool.entity';

export interface IReward {
  id: number;
  address: string;
  rewardPoolId: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('rewards')
@Index(['address', 'rewardPoolId'])
export class RewardEntity implements IReward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  address: string;

  @Column({ type: 'int' })
  rewardPoolId: number;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => RewardPoolEntity, pool => pool.rewards)
  @JoinColumn({ name: 'reward_pool_id' })
  rewardPool: RewardPoolEntity;
} 