import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionStateEntity, ITransactionState } from '../entities/transaction-state.entity';

export interface ITransactionStateRepository {
  findByKey(key: string): Promise<ITransactionState | null>;
  create(data: Partial<ITransactionState>): Promise<ITransactionState>;
  updateByKey(key: string, data: Partial<ITransactionState>): Promise<void>;
  getOrCreate(key: string, defaultValue: string, description?: string): Promise<ITransactionState>;
}

@Injectable()
export class TransactionStateRepository implements ITransactionStateRepository {
  constructor(
    @InjectRepository(TransactionStateEntity)
    private readonly repository: Repository<TransactionStateEntity>,
  ) {}

  async findByKey(key: string): Promise<ITransactionState | null> {
    return this.repository.findOne({
      where: { key }
    });
  }

  async create(data: Partial<ITransactionState>): Promise<ITransactionState> {
    const transactionState = this.repository.create(data);
    return this.repository.save(transactionState);
  }

  async updateByKey(key: string, data: Partial<ITransactionState>): Promise<void> {
    await this.repository.update(
      { key },
      data
    );
  }

  async getOrCreate(key: string, defaultValue: string, description?: string): Promise<ITransactionState> {
    let transactionState = await this.findByKey(key);

    if (!transactionState) {
      transactionState = await this.create({
        key,
        value: defaultValue,
        description,
      });
    }

    return transactionState;
  }
}