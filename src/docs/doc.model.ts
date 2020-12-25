import { Document, Schema } from 'mongoose';

export interface IDoc extends Document {
  _id: string;
  title: string;
  description: string;
  image: MyImage;
  date: Date;
  end: Date;
}

export interface MyImage {
  data: Buffer;
  contentType: ImageTypes;
  name: string;
}

export interface TransferringImage {
    data: string;
    contentType: ImageTypes;
    name: string;
  }

  export interface TransferringDoc {
    _id: string;
    title: string;
    description: string;
    image: TransferringImage;
    date: Date;
    end: Date;
  }

enum ImageTypes {
  jpeg = 'image/jpeg',
  png = 'image/png',
  jpg = 'image/jpg',
}

export const DocSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    data: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      enum: [ImageTypes.jpeg, ImageTypes.jpg, ImageTypes.png],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  date: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
  },
});
