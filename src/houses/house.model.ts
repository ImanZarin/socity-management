import { Document, Schema } from "mongoose"



export interface IHouse extends Document {
    flatNo: number

}

export const HouseSchema = new Schema({
    flatNo: {
        type: Number,
        required: true,
        index: true
    }
})