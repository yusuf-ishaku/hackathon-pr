/* eslint-disable prettier/prettier */
import {
  Table,
  ForeignKey,
  Column,
  HasMany,
  BelongsTo,
  Model,
} from 'sequelize-typescript';
import { User } from 'src/auth/user.model';
import { Media } from 'src/images/images.model';
import { Posts } from 'src/posts/post.model';
@Table
export class Comment extends Model {
  @Column
  text: string;
  @ForeignKey(() => User)
  @Column
  user_id: number;
  @BelongsTo(() => User)
  user: User;
  @HasMany(() => Media)
  media: Media[];
  @ForeignKey(() => Posts)
  @Column
  post_id: number;
  @BelongsTo(() => Posts)
  post: Posts;
}
