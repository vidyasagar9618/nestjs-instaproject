import { Test, TestingModule } from '@nestjs/testing';
import { PostingImageController } from './posting-image.controller';

describe('PostingImageController', () => {
  let controller: PostingImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostingImageController],
    }).compile();

    controller = module.get<PostingImageController>(PostingImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
