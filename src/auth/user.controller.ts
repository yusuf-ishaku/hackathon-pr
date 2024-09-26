/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
//   Delete,
  Get,
  Next,
//   Param,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from 'src/interfaces/user.interface';
import * as argon2 from 'argon2';
import { NextFunction, Response } from 'express';
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async create(
    @Body() body: IUser,
    @Res() response: Response,
    @Next() next: NextFunction,
  ): Promise<any> {
    try {
      const isUserExist = await this.userService.findOne(body.email);
      if (isUserExist) {
        return response.status(400).json({ message: 'User already exists' });
      }
      const hash = await argon2.hash(body.password);
      // console.log(hash);
      const data = await this.userService.create({
        username: body.username,
        password: hash,
        email: body.email,
      });
      return {
        message: 'User created',
        data: { ...data, password: 'hidden' },
      };
    } catch (error: unknown) {
      next(error);
    }
  }
  @Post('login')
  async login(@Body() body: IUser, @Next() next: NextFunction): Promise<IUser> {
    try {
      const user = await this.userService.login({
        email: body.email,
      });
      console.log(user);
      if (user) {
        const isPasswordValid = await argon2.verify(
          user.password,
          body.password,
        );
        if (isPasswordValid) {
          return user;
        }
      }
    } catch (error: unknown) {
      console.log(error);
      next(error);
    }
  }
  @Get()
  async getAll(): Promise<IUser[]> {
    return this.userService.findAll();
  }
//   @Delete(':id')
//   async remove(@Body() body: User, @Param('id') id: string): Promise<void> {
//     console.log(body);
//     console.log(id);
//     return await this.userService.remove(id);
//   }
}
