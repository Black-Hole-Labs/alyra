import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class RenameObserverStatesToTransactionStates1752941857477 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создаем новую таблицу transaction_states
    await queryRunner.createTable(
      new Table({
        name: 'transaction_states',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'key',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'value',
            type: 'text',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '500',
            isNullable: true,
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

    // Создаем уникальный индекс на key
    await queryRunner.query(
      'CREATE UNIQUE INDEX IDX_transaction_states_key ON transaction_states (key)'
    );

    // Если старая таблица observer_states существует, переносим данные
    const observerStatesExists = await queryRunner.hasTable('observer_states');
    if (observerStatesExists) {
      // Переносим данные из observer_states в transaction_states
      await queryRunner.query(`
        INSERT INTO transaction_states (key, value, description, created_at, updated_at)
        SELECT key, value, description, created_at, updated_at
        FROM observer_states
        ON CONFLICT (key) DO NOTHING
      `);
      
      // Удаляем старую таблицу
      await queryRunner.dropTable('observer_states');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Создаем обратно таблицу observer_states
    await queryRunner.createTable(
      new Table({
        name: 'observer_states',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'key',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'value',
            type: 'text',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '500',
            isNullable: true,
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

    // Переносим данные обратно
    await queryRunner.query(`
      INSERT INTO observer_states (key, value, description, created_at, updated_at)
      SELECT key, value, description, created_at, updated_at
      FROM transaction_states
    `);

    // Удаляем новую таблицу
    await queryRunner.dropTable('transaction_states');
  }
}