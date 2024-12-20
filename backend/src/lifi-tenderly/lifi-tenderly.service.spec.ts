import { Test, TestingModule } from '@nestjs/testing';
import { LifiTenderlyService } from './lifi-tenderly.service';

describe('LifiTenderlyService', () => {
  let service: LifiTenderlyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifiTenderlyService],
    }).compile();

    service = module.get<LifiTenderlyService>(LifiTenderlyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
