/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './auth/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule} from '@nestjs/config';
import { User } from './auth/user.model';
import { Posts } from './posts/post.model';
import { Media } from './images/images.model';
import { PostsModule } from './posts/post.module';
@Module({
  imports: [
    UserModule,
    PostsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '',
        database: process.env.DATABASE,
        models: [User, Posts, Media],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
