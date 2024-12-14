import { Test, TestingModule } from '@nestjs/testing';
import { LifiController } from './lifi.controller';

describe('LifiController', () => {
  let controller: LifiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifiController],
    }).compile();

    controller = module.get<LifiController>(LifiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
