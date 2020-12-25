import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { HouseModule } from './houses/houses.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MyGraphql } from './graphql';
import { ElectionModule } from './elections/elections.module';
import { ElectionUserModule } from './electionuser/electionuser.module';
import { DocModule } from './docs/docs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return ({
          uri: configService.get<string>("MONGO_URL"),
        });
      },
      inject: [ConfigService]
    }),
    UserModule,
    HouseModule,
    ElectionModule,
    ElectionUserModule,
    DocModule,
  ],
  controllers: [AppController],
  providers: [AppService, MyGraphql],
})
export class AppModule { }
