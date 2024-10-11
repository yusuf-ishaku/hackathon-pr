/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,
      ) {}
      async findAll(): Promise<User[]> {
        return this.userModel.findAll();
      }
      async findOne(email: string): Promise<User> {
        return this.userModel.findOne({
          where: {
            email,
          },
        });
      }
      async findById(id: string): Promise<User> {
        return this.userModel.findOne({
          where: {
            id,
          },
        });
      }
      async create(user: Partial<User>): Promise<User> {
        return this.userModel.create(user);
      }
      async remove(id: string): Promise<void> {
        const user = await this.userModel.findOne({
          where: {  id },
        });
        await user.destroy();
      }
      async login(user: Partial<User>): Promise<User> {
        const logUser = this.userModel.findOne({
          where: {
            email: user.email,
          },
        });
       return logUser;
      }
}
