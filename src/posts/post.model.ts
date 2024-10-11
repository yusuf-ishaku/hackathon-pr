/* eslint-disable prettier/prettier */
import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from 'src/auth/user.model';
import { Media } from 'src/images/images.model';

@Table
export class Posts extends Model {
  @Column
  text: string;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Media)
  media: Media[];
}