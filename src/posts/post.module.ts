/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PostsController } from './post.controller';
import {PostsService } from './post.service';
import { Posts } from './post.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { MediaService } from 'src/images/images.service';
import { Media } from 'src/images/images.model';
import { User } from 'src/auth/user.model';
import { UserService } from 'src/auth/user.service';

@Module({
  imports: [SequelizeModule.forFeature([Posts, Media, User])],
  controllers: [PostsController],
  providers: [PostsService, MediaService, UserService],
})
export class PostsModule {}