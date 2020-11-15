import { Schema, Document } from "mongoose";


export interface IUser extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    //role: IRole;
    phone: number;
    //guests: Guest[];
}

export enum IRole {
    owner,
    tenent,
    admin,
    staff
}

export type Guest = {
    fullName: string;
    vehicleNo: string;
}

const GuestType = {
    fullName: String,
    vehicleNo: String
}

export const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        default: "",
        lowercase: true
    },
    // role: {
    //     type: String,
    //     enum: IRole,
    //     required: true
    // },
    phone: {
        type: Number,
        required: true
    },
    // guests: {
    //     type: [GuestType],
    //     default: []
    // }
})

