import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
  ) {}

  async findByAddress(address: string): Promise<TransactionEntity[]> {
    return this.repository.find({
      where: {
        address: address,
      },
      order: {
        timestamp: 'DESC',
      },
    });
  }

  async findByAddressAndChainId(address: string, chainId: number): Promise<TransactionEntity[]> {
    return this.repository.find({
      where: {
        address: address,
        chainId,
      },
      order: {
        timestamp: 'DESC',
      },
    });
  }

  async findByTransactionHash(transactionHash: string, chainId: number): Promise<TransactionEntity | null> {
    return this.repository.findOne({
      where: {
        transactionHash,
        chainId,
      },
    });
  }

  async findByDateRange(startTimestamp: number, endTimestamp: number): Promise<TransactionEntity[]> {
    return this.repository.find({
      where: {
        timestamp: {
          $gte: startTimestamp,
          $lte: endTimestamp,
        } as any,
      },
      order: {
        timestamp: 'ASC',
      },
    });
  }

  async create(data: Partial<TransactionEntity>): Promise<TransactionEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async createMany(data: Partial<TransactionEntity>[]): Promise<TransactionEntity[]> {
    const entities = this.repository.create(data);
    return this.repository.save(entities);
  }

  async update(id: number, data: Partial<TransactionEntity>): Promise<TransactionEntity | null> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
} 