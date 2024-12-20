import { Module } from '@nestjs/common';
import { LifiTenderlyController } from './lifi-tenderly.controller';
import { LifiTenderlyService } from './lifi-tenderly.service';

@Module({
  controllers: [LifiTenderlyController],
  providers: [LifiTenderlyService]
})
export class LifiTenderlyModule {}
