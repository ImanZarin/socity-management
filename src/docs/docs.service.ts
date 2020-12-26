import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDoc, MyImage, TransferringDoc } from './doc.model';

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
      if (!duration) duration = 0;
      const today = new Date();
      re = await new this.docModel({
        image: image,
        title: title,
        description: desc,
        date: today,
      });
    }
    await re.save();
    return re._id;
  }

  async delete(id: string): Promise<boolean> {
    const re = await this.docModel.findByIdAndDelete(id);
    return re !== null;
  }

  async getRecent(last: number): Promise<TransferringDoc[]> {
    const docs = await this.docModel.find().sort({"date": -1}).limit(last).exec();
    const newList = docs.map(doc => this.convertToTransferingDoc(doc));
    return newList;
  }

  async getOne(id: string): Promise<TransferringDoc> {
    const d = await this.docModel.findById(id);
    return this.convertToTransferingDoc(d);
  }

  private convertToTransferingDoc(param: IDoc): TransferringDoc {
    return {
      title: param.title,
      _id: param._id,
      description: param.description,
      image: {
        data: param.image.data.toString('base64'),
        contentType: param.image.contentType,
        name: param.image.name,
      },
      date: param.date,
    };
  }
}
