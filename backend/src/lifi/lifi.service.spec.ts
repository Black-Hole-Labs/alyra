import { Test, TestingModule } from '@nestjs/testing';
import { LifiService } from './lifi.service';

describe('LifiService', () => {
  let service: LifiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifiService],
    }).compile();

    service = module.get<LifiService>(LifiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
