/* eslint-disable prettier/prettier */
import { Media } from 'src/images/images.model';

export interface IPost {
    text: string;
    user_id: number;
    media: Array<Media>;
  }
  