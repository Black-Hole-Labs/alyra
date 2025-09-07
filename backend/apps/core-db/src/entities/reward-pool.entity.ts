import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { TokenEntity } from './token.entity';
import { RewardEntity } from './reward.entity';

export interface IRewardPool {
  id: number;
  amount: number;
  claimerAddress: string;
  rewardTokenId: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('reward_pools')
export class RewardPoolEntity implements IRewardPool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  amount: number;

  @Column({ length: 255 })
  claimerAddress: string;

  @Column({ type: 'int' })
  rewardTokenId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RewardEntity, reward => reward.rewardPool)
  rewards: RewardEntity[];

  @ManyToOne(() => TokenEntity, token => token.rewardPools)
  @JoinColumn({ name: 'reward_token_id' })
  rewardToken: TokenEntity;
} 