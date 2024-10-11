/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { PostsService } from './post.service';
import { IPost } from 'src/interfaces/post.interface';
import { Response } from 'express';
// import { Posts } from './post.model';
import { MediaService } from 'src/images/images.service';
import { UserService } from 'src/auth/user.service';

@Controller('post')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly mediaService: MediaService,
    private readonly userService: UserService,
  ) {}
  @Post()
  async create(@Body() body: IPost, @Res() res: Response): Promise<any> {
    console.log(body);
    const data = await this.postService.create({
      text: body.text,
      user_id: body.user_id,
    });
    if (body.media) {
      body.media?.forEach(async (media) => {
        this.mediaService.create({ ...media, post_id: data.id });
      });
    }
    return res.status(201).json({ ...data });
  }
  // @Get()
  // async getAll(): Promise<Posts[]> {
  //   return this.postService.findAll();
  // }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<any> {
    const media = await this.mediaService.getByPost(id);
    const post = await this.postService.findOne(id);
    const user = await this.userService.findById(`${post.user_id}`);
    return { post, media, user };
  }
  @Get()
  async getAllPosts(): Promise<any> {
    const posts = await this.postService.findAll();
    // Extract data values from posts
    const postsData = posts.map((post) => post.get({ plain: true }));
    // Optionally, you can also extract data values from media if needed
    const postsWithMediaAndUser = await Promise.all(
      postsData.map(async (post) => {
        const postMedia = (await this.mediaService.getByPost(post.id));
        const user = (await this.userService.findById(`${post.user_id}`)).get({ plain: true });
        return { ...post, media: postMedia, user: {...user, password: ''} };
      })
    );
    return postsWithMediaAndUser;
  }
  //   async getPostsByUser(@Param('id') id: string): Promise<Posts[]> {
  //     return this.postService.getByUser(id);
  //   }
  @Delete(':id')
  async deletePost(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<any> {
    await this.postService.remove(id);
    return res.status(200).json({ message: 'Post deleted' });
  }
}
