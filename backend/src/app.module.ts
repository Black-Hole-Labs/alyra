import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LifiModule } from './lifi/lifi.module';
import { LifiTenderlyService } from './lifi-tenderly/lifi-tenderly.service';
import { LifiTenderlyModule } from './lifi-tenderly/lifi-tenderly.module';
import { GoogleSheetModule } from './google-sheet/google-sheet.module';

@Module({
  imports: [LifiModule, LifiTenderlyModule, GoogleSheetModule],
  controllers: [AppController],
  providers: [AppService, LifiTenderlyService],
})
export class AppModule {}
