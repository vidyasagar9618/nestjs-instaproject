import { Test, TestingModule } from '@nestjs/testing';
import { PostingImageService } from './posting-image.service';

describe('PostingImageService', () => {
  let service: PostingImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostingImageService],
    }).compile();

    service = module.get<PostingImageService>(PostingImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
