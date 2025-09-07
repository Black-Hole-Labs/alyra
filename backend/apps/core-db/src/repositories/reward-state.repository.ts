import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RewardStateEntity, IRewardState } from '../entities/reward-state.entity';

export interface IRewardStateRepository {
  findByReferrerAddress(referrerAddress: string): Promise<IRewardState | null>;
  create(data: Partial<IRewardState>): Promise<IRewardState>;
  updateByReferrerAddress(referrerAddress: string, data: Partial<IRewardState>): Promise<void>;
  getOrCreate(referrerAddress: string): Promise<IRewardState>;
}

@Injectable()
export class RewardStateRepository implements IRewardStateRepository {
  constructor(
    @InjectRepository(RewardStateEntity)
    private readonly repository: Repository<RewardStateEntity>,
  ) {}

  async findByReferrerAddress(referrerAddress: string): Promise<IRewardState | null> {
    return this.repository.findOne({
      where: { referrerAddress: referrerAddress.toLowerCase() }
    });
  }

  async create(data: Partial<IRewardState>): Promise<IRewardState> {
    const rewardState = this.repository.create(data);
    return this.repository.save(rewardState);
  }

  async updateByReferrerAddress(referrerAddress: string, data: Partial<IRewardState>): Promise<void> {
    await this.repository.update(
      { referrerAddress: referrerAddress.toLowerCase() },
      data
    );
  }

  async getOrCreate(referrerAddress: string): Promise<IRewardState> {
    let rewardState = await this.findByReferrerAddress(referrerAddress);

    if (!rewardState) {
      // Создаем новое состояние с очень старым timestamp
      rewardState = await this.create({
        referrerAddress: referrerAddress.toLowerCase(),
        lastProcessedTimestamp: 0, // Начинаем с самого начала
      });
    }

    return rewardState;
  }
}