/* eslint-disable prettier/prettier */
import { Media } from "src/images/images.model";
export class CreateCommentDto {
    readonly post_id: number;
    readonly user_id: number;
    readonly text: string;
    readonly media?: Media[];
}
