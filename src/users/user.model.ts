import { Schema, Document, Types } from 'mongoose';
import { IHouse } from 'src/houses/house.model';

export interface IUser extends Document {
  _id: string;
  nationalNO: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  position: string;
  house: Types.ObjectId | IHouse;
  newPassNeeded: boolean;
  //guests: Guest[];
}

export enum Role {
  owner = 'owner',
  tenant = 'tenant',
  admin = 'admin',
  staff = 'staff',
  none = 'none',
}

// export type Guest = {
//     fullName: string;
//     vehicleNo: string;
// }

// const GuestType = {
//     fullName: String,
//     vehicleNo: String
// }

export const UserSchema = new Schema({
  nationalNO: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: '',
    lowercase: true,
  },
  role: {
    type: String,
    enum: [Role.admin, Role.owner, Role.staff, Role.tenant],
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: false,
  },
  house: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'House',
  },
  newPassNeeded: {
    type: Boolean,
    default: true,
  },
  // guests: {
  //     type: [GuestType],
  //     default: []
  // }
});
