import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { BreedsModule } from './breeds/breeds.module';
import { Cat } from './cats/entities/cat.entity';
import { Breed } from './breeds/entities/breed.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    // entities: [Cat,Breed,User],
    autoLoadEntities: true,
    synchronize: true,
    ssl: process.env.POSTGRES_SSL === "true",
    extra: {
      ssl:
        process.env.POSTGRES_SSL === "true"
          ? {
              rejectUnauthorized: false,
            }
          : null,
    },    
  }),
  CatsModule,
  BreedsModule,
  UsersModule,
  AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
