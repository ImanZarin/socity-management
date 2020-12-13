import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ElectionUserModule } from 'src/electionuser/electionuser.module';
import { ElectionSchema } from './election.model';
import { ElectionService } from './election.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Election', schema: ElectionSchema }]),
    ElectionUserModule
  ],
  providers: [ElectionService],
  exports: [ElectionService],
})
export class ElectionModule {}
