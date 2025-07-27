import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export interface IObserverState {
  id: number;
  key: string;
  value: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('observer_states')
@Index(['key'], { unique: true })
export class ObserverStateEntity implements IObserverState {
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