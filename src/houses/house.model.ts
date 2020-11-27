import { Document, Schema, Types } from 'mongoose';
import { IUser } from 'src/users/user.model';

export interface IHouse extends Document {
  flatNo: number;
  _id: string;
  // ownerId: Types.ObjectId | IUser,
  // tenantId: Types.ObjectId | IUser
}

export const HouseSchema = new Schema({
  flatNo: {
    type: Number,
    required: true,
    index: true
  },
  // ownerId: {
  //     type: Schema.Types.ObjectId,
  //     required: false,
  //     ref: "User"
  // },
  // tenantId: {
  //     type: Schema.Types.ObjectId,
  //     required: false,
  //     ref: "User"
  // }
});
