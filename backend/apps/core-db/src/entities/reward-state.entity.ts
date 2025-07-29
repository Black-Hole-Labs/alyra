import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export interface IRewardState {
  id: number;
  referrerAddress: string;
  lastProcessedTimestamp: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('reward_states')
@Index(['referrerAddress'], { unique: true })
export class RewardStateEntity implements IRewardState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  referrerAddress: string;

  @Column({ type: 'bigint' })
  lastProcessedTimestamp: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}