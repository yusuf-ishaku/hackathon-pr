/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PostsController } from './post.controller';
import {PostsService } from './post.service';
import { Posts } from './post.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { MediaService } from 'src/images/images.service';
import { Media } from 'src/images/images.model';

@Module({
  imports: [SequelizeModule.forFeature([Posts, Media])],
  controllers: [PostsController],
  providers: [PostsService, MediaService],
})
export class PostsModule {}