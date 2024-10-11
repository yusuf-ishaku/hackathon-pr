/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, 
  // Patch, 
Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { MediaService } from 'src/images/images.service';
import AiAgent from 'src/config/gemini.config';
import { UserService } from 'src/auth/user.service';
// import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService, 
    private readonly aiFn: AiAgent,
    private readonly mediaService: MediaService,
    private readonly userService: UserService
  ) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    console.log(createCommentDto);
    return this.commentsService.create(createCommentDto);
  }
  @Post('ai')
  async createAiResponse(@Body() CreateCommentDto: CreateCommentDto) {
    if (CreateCommentDto.media) {
     const result = await this.aiFn.getResponseToImagePrompt(CreateCommentDto.text, CreateCommentDto.media[0]);
    return this.commentsService.create(result);
    } else {
      const response = await this.aiFn.getTextResponse(CreateCommentDto.text);
      console.log(response);
      const normalizedResponse = response.toString().substring(0, 255);
      return this.commentsService.create({
        text: normalizedResponse,
        post_id: CreateCommentDto.post_id,
        user_id: CreateCommentDto.user_id,
      });
    }
  }
  @Get()
  async findAll() {
    const commentsData = (await this.commentsService.findAll()).map((comment) => comment.get({ plain: true }));
    const commentsWithMediaAndUser = await Promise.all(
      commentsData.map(async (post) => {
        const postMedia = await this.mediaService.getByComment(post.id);
        const user = (await this.userService.findById(`${post.user_id}`)).get({ plain: true });
        return { ...post, media: postMedia, user: {...user, password: ''} };
      })
    );
    return commentsWithMediaAndUser
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }
  @Get('/comments/:id')
  async findByPostId(@Param('id') id: string) {
    const commentsData = (await this.commentsService.findByPostId(id)).map((comment) => comment.get({ plain: true }));
    const commentsWithMediaAndUser = await Promise.all(
      commentsData.map(async (post) => {
        const postMedia = (await this.mediaService.getByComment(post.id)) ;
        const user = (await this.userService.findById(`${post.user_id}`)).get({ plain: true });
        return { ...post, media: postMedia, user: {...user, password: ''} };
      })
    );
    return commentsWithMediaAndUser;
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
  //   return this.commentsService.update(+id, updateCommentDto);
  // }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
