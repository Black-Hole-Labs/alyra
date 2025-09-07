import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { RewardPoolEntity } from './reward-pool.entity';

export interface IToken {
  id: number;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  chainId: number;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('tokens')
@Index(['address', 'chainId'], { unique: true })
export class TokenEntity implements IToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  symbol: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  address: string;

  @Column({ type: 'int' })
  decimals: number;

  @Column({ type: 'bigint' })
  chainId: number;

  @Column({ length: 500, nullable: true })
  icon?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RewardPoolEntity, pool => pool.rewardToken)
  rewardPools: RewardPoolEntity[];
} 