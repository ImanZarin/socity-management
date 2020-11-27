import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HouseService } from 'src/houses/house.service';
import { UserSchema } from './user.model';
import { UserService } from './users.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
