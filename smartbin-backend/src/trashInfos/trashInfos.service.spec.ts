import { Test, TestingModule } from '@nestjs/testing';
import { TrashInfosService } from './trashInfos.service';

describe('TrashInfosService', () => {
  let service: TrashInfosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrashInfosService],
    }).compile();

    service = module.get<TrashInfosService>(TrashInfosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
