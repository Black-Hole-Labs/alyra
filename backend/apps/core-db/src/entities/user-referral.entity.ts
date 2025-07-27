import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { UserEntity } from './user.entity';

export interface IUserReferral {
  id: number;
  userId: number;
  userAddress: string;
  userChainId: number;
  joinedAt: Date;
  user?: UserEntity;
}

@Entity('user_referrals')
@Index(['userAddress', 'userChainId'], { unique: true })
export class UserReferralEntity implements IUserReferral {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ length: 255 })
  userAddress: string;

  @Column({ type: 'bigint' })
  userChainId: number;

  @CreateDateColumn()
  joinedAt: Date;

  @ManyToOne(() => UserEntity, user => user.userReferrals)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
} 