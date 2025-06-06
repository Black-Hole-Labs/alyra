import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configSchema } from './config/config';
import { GoogleSheetModule } from './google-sheet/google-sheet.module';
import { LifiTenderlyModule } from './lifi-tenderly/lifi-tenderly.module';
import { LifiTenderlyService } from './lifi-tenderly/lifi-tenderly.service';
import { LifiModule } from './lifi/lifi.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    LifiModule,
    LifiTenderlyModule,
    GoogleSheetModule,
  ],
  controllers: [AppController],
  providers: [AppService, LifiTenderlyService],
})
export class AppModule {}
