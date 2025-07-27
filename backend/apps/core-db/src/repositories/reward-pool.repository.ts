import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RewardPoolEntity } from '../entities/reward-pool.entity';

@Injectable()
export class RewardPoolRepository {
  constructor(
    @InjectRepository(RewardPoolEntity)
    private readonly repository: Repository<RewardPoolEntity>,
  ) {}

  async findAll(): Promise<RewardPoolEntity[]> {
    return this.repository.find({
      relations: ['rewardToken'],
    });
  }

  async findById(id: number): Promise<RewardPoolEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['rewardToken'],
    });
  }

  async create(data: Partial<RewardPoolEntity>): Promise<RewardPoolEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<RewardPoolEntity>): Promise<RewardPoolEntity | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
} 