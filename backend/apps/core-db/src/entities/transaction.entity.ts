import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export interface ITransaction {
  id: number;
  transactionHash: string;
  chainId: number;
  address: string;
  amount: number;
  amountUSD?: number;
  tokenAddress?: string;
  tokenSymbol?: string;
  transactionType: string;
  timestamp: number;
  createdAt: Date;
}

@Entity('transactions')
@Index(['transactionHash', 'chainId'], { unique: true })
@Index(['address', 'chainId'])
@Index(['timestamp'])
export class TransactionEntity implements ITransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  transactionHash: string;

  @Column({ type: 'bigint' })
  chainId: number;

  @Column({ length: 255 })
  address: string;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  amount: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  amountUSD?: number;

  @Column({ length: 255, nullable: true })
  tokenAddress?: string;

  @Column({ length: 20, nullable: true })
  tokenSymbol?: string;

  @Column({ length: 50 })
  transactionType: string;

  @Column({ type: 'bigint' })
  timestamp: number;

  @CreateDateColumn()
  createdAt: Date;
} 