import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ElectionUserService } from './electionuser.service';
import { ElectionUserSchema } from './electionusers.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'ElectionUser',
        schema: ElectionUserSchema,
      },
    ]),
  ],
  providers: [ElectionUserService],
  exports: [ElectionUserService],
})
export class ElectionUserModule {}
