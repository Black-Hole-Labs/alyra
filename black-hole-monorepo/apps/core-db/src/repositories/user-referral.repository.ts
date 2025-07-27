import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserReferralEntity, IUserReferral } from '../entities/user-referral.entity';

export interface IUserReferralRepository {
  create(data: Partial<IUserReferral>): Promise<IUserReferral>;
  findByAddress(address: string, chainId: number): Promise<IUserReferral | null>;
  findByUserId(userId: number): Promise<IUserReferral[]>;
  findWithTransactions(userReferralId: number): Promise<IUserReferral | null>;
  findUserReferralsByUserId(userId: number): Promise<IUserReferral[]>;
  findAllWithUsers(): Promise<IUserReferral[]>;
}

@Injectable()
export class UserReferralRepository implements IUserReferralRepository {
  constructor(
    @InjectRepository(UserReferralEntity)
    private readonly repository: Repository<UserReferralEntity>,
  ) {}

  async create(data: Partial<IUserReferral>): Promise<IUserReferral> {
    const userReferral = this.repository.create(data);
    return this.repository.save(userReferral);
  }

  async findByAddress(address: string, chainId: number): Promise<IUserReferral | null> {
    return this.repository.findOne({ 
      where: { userAddress: address, userChainId: chainId },
      relations: ['user']
    });
  }

  async findByUserId(userId: number): Promise<IUserReferral[]> {
    return this.repository.find({ 
      where: { userId },
    });
  }

  async findWithTransactions(userReferralId: number): Promise<IUserReferral | null> {
    return this.repository.findOne({
      where: { id: userReferralId },
    });
  }

  async findUserReferralsByUserId(userId: number): Promise<IUserReferral[]> {
    return this.repository.find({
      where: { userId },
      order: { joinedAt: 'DESC' }
    });
  }

  async findAllWithUsers(): Promise<IUserReferral[]> {
    return this.repository.find({
      relations: ['user'],
      order: { joinedAt: 'DESC' }
    });
  }
} 