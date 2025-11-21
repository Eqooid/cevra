import { Test, TestingModule } from '@nestjs/testing';
import { VectorStorageService } from './vector-storage.service';

describe('VectorStorageService', () => {
  let service: VectorStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VectorStorageService],
    }).compile();

    service = module.get<VectorStorageService>(VectorStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
