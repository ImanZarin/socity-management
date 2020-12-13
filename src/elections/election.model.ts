import { Document, Schema } from 'mongoose';

export interface IElection extends Document {
  _id: string;
  title: string;
  start: string;
  end: string;
  options: ElectionOption[];
  hasImg: boolean;
}

export interface ElectionOption {
  name: string;
  imgUrl: string;
  percent: number;
}

export const ElectionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
    default: [],
  },
  hasImg: {
    type: Boolean,
    default: false,
  },
});
