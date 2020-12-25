import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDoc, MyImage, TransferringDoc } from './doc.model';
import * as fs from 'fs';
import { title } from 'process';

@Injectable()
export class DocService {
  constructor(@InjectModel('Doc') private readonly docModel: Model<IDoc>) {}

  async createAndUpdate(
    title: string,
    desc: string,
    image: MyImage,
    id?: string,
    duration?: number,
  ): Promise<string> {
    let re: IDoc;
    if (id) {
      re = await this.docModel.findById(id);
      if (title) re.title = title;
      if (desc) re.description = desc;
      if (image) {
        re.image = {
          data: image.data,
          contentType: image.contentType,
          name: image.name,
        };
      }
      if (duration) {
        const d = re.date;
        re.end = new Date(d.setDate(d.getDate() + duration));
      }
    } else {
      if(!duration) duration = 0;
      const today = new Date();
      const end = new Date(today);
      re = await new this.docModel({
        image: image,
        title: title,
        description: desc,
        date: today,
        end: end.setDate(today.getDate() + duration),
      });
    }
    await re.save();
    return re._id;
  }

  async delete(id: string): Promise<boolean> {
    const re = await this.docModel.findByIdAndDelete(id);
    return re !== null;
  }

  async getRecent(): Promise<TransferringDoc[]> {
    const docs = await this.docModel.find().exec();
    docs.filter(d => !d.end || d.end > new Date());
    const newList = docs.map(doc => {
      return {
        title: doc.title,
        _id: doc._id,
        description: doc.description,
        image: {
          data: doc.image.data.toString('base64'),
          contentType: doc.image.contentType,
          name: doc.image.name,
        },
        date: doc.date,
        end: doc.end,
      };
    });
    return newList.sort((a, b) => (a.date > b.date ? -1 : 1));
  }
}
