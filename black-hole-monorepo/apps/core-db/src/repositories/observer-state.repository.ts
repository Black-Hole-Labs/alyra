import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObserverStateEntity } from '../entities/observer-state.entity';

@Injectable()
export class ObserverStateRepository {
  constructor(
    @InjectRepository(ObserverStateEntity)
    private readonly repository: Repository<ObserverStateEntity>,
  ) {}

  async findByKey(key: string): Promise<ObserverStateEntity | null> {
    return this.repository.findOne({
      where: { key },
    });
  }

  async getValue(key: string): Promise<string | null> {
    const state = await this.findByKey(key);
    return state ? state.value : null;
  }

  async setValue(key: string, value: string, description?: string): Promise<ObserverStateEntity> {
    let state = await this.findByKey(key);
    
    if (state) {
      state.value = value;
      if (description) {
        state.description = description;
      }
      return this.repository.save(state);
    } else {
      const newState = this.repository.create({
        key,
        value,
        description,
      });
      return this.repository.save(newState);
    }
  }

  async deleteByKey(key: string): Promise<void> {
    await this.repository.delete({ key });
  }

  async getAll(): Promise<ObserverStateEntity[]> {
    return this.repository.find({
      order: { key: 'ASC' },
    });
  }
} 