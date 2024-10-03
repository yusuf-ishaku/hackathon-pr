/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Posts } from 'src/posts/post.model';
import { Media } from 'src/images/images.model';
import { User } from 'src/auth/user.model';
import AiAgent from 'src/config/gemini.config';

@Module({
  imports: [SequelizeModule.forFeature([Posts, Media, User, Comment])],
  controllers: [CommentsController],
  providers: [CommentsService, AiAgent],
})
export class CommentsModule {}
