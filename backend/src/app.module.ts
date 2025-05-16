import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LifiModule } from './lifi/lifi.module';
import { LifiTenderlyService } from './lifi-tenderly/lifi-tenderly.service';
import { LifiTenderlyModule } from './lifi-tenderly/lifi-tenderly.module';

@Module({
  imports: [LifiModule, LifiTenderlyModule],
  controllers: [AppController],
  providers: [AppService, LifiTenderlyService],
})
export class AppModule {}
