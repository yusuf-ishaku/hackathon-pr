/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
//   Delete,
  Get,
  HttpStatus,
  Next,
//   Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from 'src/interfaces/user.interface';
import * as argon2 from 'argon2';
import { NextFunction, Response } from 'express';
import GoogleAuth from 'src/config/google.config';
import axios from 'axios';
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService, private readonly googleService: GoogleAuth ) {}
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
      return response.status(201).json({
        message: 'User created',
        data: { username: data.username, id: data.id, email: data.email, password: '' },
      })
    } catch (error: unknown) {
      next(error);
    }
  }
  @Post('login')
  async login(@Body() body: IUser, @Res() res: Response, @Next() next: NextFunction): Promise<unknown> {
    try {
      const user = await this.userService.login({
        email: body.email,
      });
      if (user) {
        const isPasswordValid = await argon2.verify(
          user.password,
          body.password,
        );
        if (isPasswordValid) {
          return  res.status(200).json({
            message: 'Login success',
            data: { username: user.username, id: user.id, email: user.email },
          });
        }
      } else {
        res.status(404).json({
          "message": "User not found"
        })
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
  @Get('/google')
  async googleLogin(@Query() query: string, @Body() body: {token: string}, @Res() res): Promise<any> {
    try {
      const redirectUrl = process.env.REDIRECT_URL || 'http://localhost:3000';
      const code = query;
      let googleData;
      if (code) {
        const { tokens } = await this.googleService.client.getToken(code);
        const { data } =
        await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`
          }
        });
        googleData = data;
        console.log(googleData);
      } else {
        const token = body.token;
        const { data } =
        await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        googleData = data;
      }
      // console.log(googleData);
      const userExists =
      await this.userService.login({email: googleData.email});
      if (!userExists) {
        // console.log("In");
        const data = await this.userService.create({
          email: googleData.email,
          password: '',
        } as IUser);
        console.log('the data:', data);
        // const token = await this.UserUtils.signToken({
        //   email: data.email,
        //   userId: data._id,
        //   role: data.role
        // });
        // eslint-disable-next-line max-len
        return res.redirect(`${redirectUrl}/auth/login/${data.id}`);
      } else if (userExists) {
        // res.redirect('http://localhost:3000/dashboard/home')
        // const token = await this.UserUtils.signToken({
        //   email: userExists.email,
        //   userId: userExists._id,
        //   role: userExists.role
        // });
        // res.cookie('jwt', t, {
        //   httpOnly: true, //accessible only by web server
        //   secure: true, //https
        //   sameSite: false, //cross-site cookie
        //   maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
        // });
        // eslint-disable-next-line max-len
        res.redirect(`${redirectUrl}/auth/login/${userExists.id}`);
      }
    } catch (error) {
      // console.error(error);
      console.log('Error:', error);
      res.status(HttpStatus.CONFLICT).json({
        code: HttpStatus.CONFLICT,
        data: '',
        message: 'An error encoutered'
      });
    }
  }
//   @Delete(':id')
//   async remove(@Body() body: User, @Param('id') id: string): Promise<void> {
//     console.log(body);
//     console.log(id);
//     return await this.userService.remove(id);
//   }
}
