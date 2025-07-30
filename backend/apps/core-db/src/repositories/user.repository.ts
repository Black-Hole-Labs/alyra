import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, IUser } from '../entities/user.entity';
import { IReferralStats, IReferralSummary } from '../interfaces/referral.interface';

export interface IUserRepository {
  create(data: Partial<IUser>): Promise<IUser>;
  findByCode(code: string): Promise<IUser | null>;
  findAllByCode(code: string): Promise<IUser[]>;
  findByAddress(address: string, chainId: number): Promise<IUser | null>;
  findWithStats(id: number): Promise<IReferralStats | null>;
  findSummary(id: number): Promise<IReferralSummary | null>;
  generateUniqueCode(): Promise<string>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(data: Partial<IUser>): Promise<IUser> {
    const user = this.repository.create(data);
    const savedUser = await this.repository.save(user);
    return savedUser;
  }

  async findByCode(code: string): Promise<IUser | null> {
    const user = await this.repository.findOne({ where: { referralCode: code } });
    return user;
  }

  async findAllByCode(code: string): Promise<IUser[]> {
    const users = await this.repository.find({ where: { referralCode: code } });
    return users;
  }

  async findByAddress(address: string, chainId: number): Promise<IUser | null> {
    return this.repository.findOne({ 
      where: { address: address, chainId: chainId } 
    });
  }

  async findWithStats(id: number): Promise<IReferralStats | null> {
    const totalReferralsResult = await this.repository
      .createQueryBuilder('user')
      .leftJoin('user.userReferrals', 'userRef')
      .select([
        'user.id',
        'COUNT(DISTINCT userRef.id) as "totalReferrals"'
      ])
      .where('user.id = :id', { id })
      .groupBy('user.id')
      .getRawOne();
    
    // Считаем остальные поля без транзакций и комиссий
    const result = await this.repository
      .createQueryBuilder('user')
      .leftJoin('user.userReferrals', 'userRef')
      .select([
        'user.id',
        'user.referralCode',
        'user.address',
        'user.chainId'
        // убраны SUM(tx.amount), SUM(comm.amount) и т.д.
      ])
      .where('user.id = :id', { id })
      .groupBy('user.id')
      .getRawOne();

    if (!result) return null;
    return {
      id: result.user_id,
      referrerCode: result.user_referralCode,
      referrerAddress: result.user_address,
      chainId: result.user_chainId,
      totalReferrals: parseInt(totalReferralsResult?.totalReferrals || '0'),
      totalVolume: 0, // транзакции считаются отдельно
      totalVolumeReferred: 0,
      totalCommissions: 0, // комиссии считаются отдельно
      pendingCommissions: 0, // комиссии считаются отдельно
    };
  }

  async findSummary(id: number): Promise<IReferralSummary | null> {
    const result = await this.repository
      .createQueryBuilder('user')
      .leftJoin('user.userReferrals', 'userRef')
      .select([
        'user.id',
        'user.referralCode',
        'user.address',
        'user.chainId',
        'COUNT(DISTINCT userRef.id) as "totalReferrals"'
        // убраны SUM(tx.amount), SUM(comm.amount), MAX(tx.timestamp)
      ])
      .where('user.id = :id', { id })
      .groupBy('user.id')
      .getRawOne();

    if (!result) return null;

    return {
      referralId: result.user_id,
      referrerCode: result.user_referralCode,
      referrerAddress: result.user_address,
      chainId: result.user_chainId,
      totalReferrals: parseInt(result.totalReferrals || '0'),
      totalVolume: 0, // транзакции считаются отдельно
      totalCommissions: 0, // комиссии считаются отдельно
      lastActivity: new Date(), // не считаем lastActivity
    };
  }

  async generateUniqueCode(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code: string;
    let exists: boolean;

    do {
      code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      exists = await this.findByCode(code) !== null;
    } while (exists);

    return code;
  }
} 