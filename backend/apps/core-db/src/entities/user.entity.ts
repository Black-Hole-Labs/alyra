import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Index } from 'typeorm';
import { UserReferralEntity } from './user-referral.entity';

export interface IUser {
  id: number;
  referralCode: string;
  address: string;
  chainId: number;
  rewardPercentage: number;
  createdAt: Date;
}

@Entity('users')
@Index(['address', 'chainId'], { unique: true })
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  @Index()
  referralCode: string;

  @Column({ length: 255 })
  address: string;

  @Column({ type: 'bigint' })
  chainId: number;

  @Column({ type: 'decimal', precision: 5, scale: 4, default: 0.4000 })
  rewardPercentage: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => UserReferralEntity, userRef => userRef.user)
  userReferrals: UserReferralEntity[];
} 