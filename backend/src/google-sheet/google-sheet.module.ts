import { Module } from '@nestjs/common';
import { GoogleSheetService } from './google-sheet.service';
import { GoogleSheetController } from './google-sheet.controller';

@Module({
  controllers: [GoogleSheetController],
  providers: [GoogleSheetService],
})
export class GoogleSheetModule {}
