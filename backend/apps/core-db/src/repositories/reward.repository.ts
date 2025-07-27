import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RewardEntity } from '../entities/reward.entity';

@Injectable()
export class RewardRepository {
  constructor(
    @InjectRepository(RewardEntity)
    private readonly repository: Repository<RewardEntity>,
  ) {}

  async findByAddress(address: string): Promise<RewardEntity[]> {
    return this.repository.find({
      where: {
        address: address.toLowerCase(),
      },
      relations: ['rewardPool.rewardToken'],
    });
  }

  async findByAddressAndPool(address: string, rewardPoolId: number): Promise<RewardEntity[]> {
    return this.repository.find({
      where: {
        address: address.toLowerCase(),
        rewardPoolId,
      },
      relations: ['rewardPool.rewardToken'],
    });
  }

  async findUnclaimedByAddress(address: string): Promise<RewardEntity[]> {
    return this.repository.find({
      where: {
        address: address.toLowerCase(),
      },
      relations: ['rewardPool.rewardToken'],
    });
  }

  async findAllUnclaimed(): Promise<RewardEntity[]> {
    return this.repository.find({
      relations: ['rewardPool.rewardToken'],
    });
  }

  async findById(id: number): Promise<RewardEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['rewardPool.rewardToken'],
    });
  }

  async create(data: Partial<RewardEntity>): Promise<RewardEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<RewardEntity>): Promise<RewardEntity | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
} 