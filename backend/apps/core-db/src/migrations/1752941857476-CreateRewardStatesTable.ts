import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRewardStatesTable1752941857476 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reward_states',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'referrer_address',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'last_processed_timestamp',
            type: 'bigint',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Создаем уникальный индекс на referrer_address
    await queryRunner.query(
      'CREATE UNIQUE INDEX IDX_reward_states_referrer_address ON reward_states (referrer_address)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reward_states');
  }
}