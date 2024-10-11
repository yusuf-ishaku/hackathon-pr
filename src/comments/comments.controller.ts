/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, 
  // Patch, 
Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import AiAgent from 'src/config/gemini.config';
// import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService, private readonly aiFn: AiAgent) {}

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
  findAll() {
    return this.commentsService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }
  @Get('/comments/:id')
  findByPostId(@Param('id') id: string) {
    return this.commentsService.findByPostId(id);
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
