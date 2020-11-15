import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { HouseModule } from './houses/houses.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MyGraphql } from './graphql';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),
    MongooseModule.forRoot('mongodb://localhost/nest'),
    UserModule,
    HouseModule,
  ],
  controllers: [AppController],
  providers: [AppService, MyGraphql],
})
export class AppModule { }
