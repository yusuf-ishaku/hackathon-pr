/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostsService } from './post.service';
import { IPost } from 'src/interfaces/post.interface';
import { Posts } from './post.model';
import { MediaService } from 'src/images/images.service';

@Controller('post')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly mediaService: MediaService,
  ) {}
  @Post()
  async create(@Body() body: IPost): Promise<any> {
    console.log(body);
    const { id } = await this.postService.create({
      text: body.text,
      user_id: body.user_id,
    });
    if (body.media) {
      body.media?.forEach(async (media) => {
        this.mediaService.create({ ...media, post_id: id });
      });
    }
  }
  @Get()
  async getAll(): Promise<Posts[]> {
    return this.postService.findAll();
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<any> {
    const media = await this.mediaService.getByPost(id);
    const post = await this.postService.findOne(id);
    return {post, media};
  }
//   @Get('all')
//   async getAllPosts(): Promise<any> {
//     const posts = await this.postService.findAll();
//     const media = await this.mediaService.findAll();
// return {media, posts};
//   }
//   async getPostsByUser(@Param('id') id: string): Promise<Posts[]> {
//     return this.postService.getByUser(id);
//   }
}
