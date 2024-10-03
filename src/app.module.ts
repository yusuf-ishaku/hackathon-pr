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
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entities/comment.entity';
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
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT as unknown as number,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        models: [User, Posts, Media, 
          Comment
        ],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
