/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Media } from './images.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media)
    private userModel: typeof Media,
  ) {}

  async findAll(): Promise<Media[]> {
    return this.userModel.findAll();
  }

  findOne(id: string): Promise<Media> {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }
  async create(post: Partial<Media>): Promise<Media> {
    return this.userModel.create(post);
  }
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
  async getByUser(id: string): Promise<Media[]> {
    return this.userModel.findAll({
      where: {
        user_id: id,
      },
    });
  }
  async getByPost(id: string): Promise<Media[]> {
    return this.userModel.findAll({
      where: {
        post_id: id,
      },
    });
  }
}
