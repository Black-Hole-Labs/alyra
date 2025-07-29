import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export interface ITransactionState {
  id: number;
  key: string;
  value: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('transaction_states')
@Index(['key'], { unique: true })
export class TransactionStateEntity implements ITransactionState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ length: 500, nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}