import { Test, TestingModule } from '@nestjs/testing';
import { VectorStorageController } from './vector-storage.controller';

describe('VectorStorageController', () => {
  let controller: VectorStorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VectorStorageController],
    }).compile();

    controller = module.get<VectorStorageController>(VectorStorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
