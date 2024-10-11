/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCommentDto } from './dto/create-comment.dto';
// import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment) 
    private commentModel: typeof Comment,
  ) {}
  async create(createCommentDto: Partial<CreateCommentDto>): Promise<Comment> {
    console.log(createCommentDto);
    return this.commentModel.create(createCommentDto);
  }

  findAll(): Promise<Comment[]> {
    return this.commentModel.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async findByPostId(id: number | string): Promise<Comment[]> {
    return this.commentModel.findAll({
      where: {
        post_id: id,
      },
    });
  }
  // update(id: number, updateCommentDto: UpdateCommentDto) {
  //   return `This action updates a #${id} comment`;
  // }

  remove(id: number | string) {
    return this.commentModel.destroy({
      where: {  
        id,
      }
    });
  }
}
