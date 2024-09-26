/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Posts } from './Post.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts)
    private postsModel: typeof Posts,
  ) {}

  async findAll(): Promise<Posts[]> {
    return this.postsModel.findAll();
  }

 async findOne(id: string): Promise<Posts> {
    return this.postsModel.findOne({
        where: {
          id,
        },
      })
  };
  async create(post: Partial<Posts>): Promise<Posts> {
    return this.postsModel.create(post);
  }
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
  async getByUser(id: string): Promise<Posts[]> {
    return this.postsModel.findAll({
      where: {
        user_id: id,
      },
    });
  }
}
