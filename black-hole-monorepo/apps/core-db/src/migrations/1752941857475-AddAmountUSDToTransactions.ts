import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAmountUSDToTransactions1752941857475 implements MigrationInterface {
  name = 'AddAmountUSDToTransactions1752941857475';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "amount_usd" decimal(20,8)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "amount_usd"`);
  }
} 