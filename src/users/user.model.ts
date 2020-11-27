import { Schema, Document, Types } from 'mongoose';
import { IHouse } from 'src/houses/house.model';
import { Role } from 'src/shared/dto.models';

export interface IUser extends Document {
  _id: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  position: string;
  house: Types.ObjectId | IHouse;
  //guests: Guest[];
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
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  lastName: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
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
    ref: "House"
  },
  // guests: {
  //     type: [GuestType],
  //     default: []
  // }
});
