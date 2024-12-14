import { Test, TestingModule } from '@nestjs/testing';
import { LifiTenderlyController } from './lifi-tenderly.controller';

describe('LifiTenderlyController', () => {
  let controller: LifiTenderlyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifiTenderlyController],
    }).compile();

    controller = module.get<LifiTenderlyController>(LifiTenderlyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
