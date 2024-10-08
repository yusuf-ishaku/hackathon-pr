/* eslint-disable prettier/prettier */
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/auth/user.model';
import { Comment } from 'src/comments/entities/comment.entity';
import { Posts } from 'src/posts/post.model';

@Table
export class Media extends Model {
  @Column
  src: string;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Posts)
  @Column
  post_id: number;
  @BelongsTo(() => Posts)
  post: Posts;

  @ForeignKey(() => Comment)
  comment_id: number;
  @BelongsTo(() => Comment)
  comment: Comment;
}
