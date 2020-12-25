import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocSchema } from './doc.model';
import { DocService } from './docs.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Doc', schema: DocSchema }])],
  exports: [DocService],
  providers: [DocService],
})
export class DocModule {}
