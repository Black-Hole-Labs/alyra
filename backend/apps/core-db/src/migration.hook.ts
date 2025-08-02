import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MigrationService } from './migration.service';

@Injectable()
export class MigrationHook implements OnModuleInit {
  private readonly logger = new Logger(MigrationHook.name);

  constructor(private readonly migrationService: MigrationService) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing migration hook...');
    
    try {
      await this.migrationService.runMigrations();
      this.logger.log('Migration hook initialization completed');
    } catch (error) {
      this.logger.error('Failed to run migrations during initialization:', error);
      // В продакшене не запускаем приложение, если миграции не прошли
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }
}