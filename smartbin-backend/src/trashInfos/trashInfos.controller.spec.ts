import { Test, TestingModule } from '@nestjs/testing';
import { TrashInfosController } from './trashInfos';

describe('TrashInfosController', () => {
  let controller: TrashInfosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrashInfosController],
    }).compile();

    controller = module.get<TrashInfosController>(TrashInfosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
