/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './post.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Posts } from './post.model';
import { Media } from 'src/images/images.model';
import { PostsService } from './post.service';
import { MediaService } from 'src/images/images.service';
describe('PostsController', () => {
  let controller: PostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SequelizeModule.forFeature([Posts, Media])],
  controllers: [PostsController],
  providers: [PostsService, MediaService],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
