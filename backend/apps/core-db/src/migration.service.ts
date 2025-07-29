import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MigrationDataSource } from './migration-data-source';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async runMigrations(): Promise<void> {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    
    if (!isProduction) {
      this.logger.log('Skipping migrations in non-production environment');
      return;
    }

    try {
      this.logger.log('Starting database migrations...');
      
      // Инициализируем DataSource для миграций
      await MigrationDataSource.initialize();
      
      // Проверяем, есть ли непроведенные миграции
      const pendingMigrations = await MigrationDataSource.showMigrations();
      
      if (pendingMigrations) {
        this.logger.log('Found pending migrations, running them...');
        
        // Получаем список миграций для логирования
        const migrations = await MigrationDataSource.showMigrations();
        this.logger.log(`Pending migrations: ${migrations}`);
        
        // Запускаем миграции с таймаутом
        const timeout = setTimeout(() => {
          this.logger.error('Migration timeout - migrations taking too long');
          throw new Error('Migration timeout');
        }, 300000); // 5 минут таймаут
        
        try {
          await MigrationDataSource.runMigrations();
          clearTimeout(timeout);
          this.logger.log('Migrations completed successfully');
        } catch (error) {
          clearTimeout(timeout);
          throw error;
        }
      } else {
        this.logger.log('No pending migrations found');
      }
      
      // Закрываем DataSource для миграций
      await MigrationDataSource.destroy();
    } catch (error) {
      this.logger.error('Error running migrations:', error);
      // Закрываем DataSource в случае ошибки
      if (MigrationDataSource.isInitialized) {
        await MigrationDataSource.destroy();
      }
      throw error; // Пробрасываем ошибку, чтобы приложение не запустилось с неправильной схемой БД
    }
  }

  async showMigrations(): Promise<boolean> {
    try {
      await MigrationDataSource.initialize();
      const result = await MigrationDataSource.showMigrations();
      await MigrationDataSource.destroy();
      return result;
    } catch (error) {
      this.logger.error('Error checking migrations:', error);
      if (MigrationDataSource.isInitialized) {
        await MigrationDataSource.destroy();
      }
      return false;
    }
  }
}