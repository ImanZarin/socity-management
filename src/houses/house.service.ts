import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IHouse } from "./house.model";


@Injectable()
export class HouseService {
    constructor(@InjectModel('House') private readonly houseModel: Model<IHouse>) {

    }

    async create(flatNo: number): Promise<IHouse> {
        console.log("create is working",flatNo);
        const house = new this.houseModel({ flatNo: flatNo });
        const result = await house.save();
        console.log(result);
        return result;
    }

    async getAll(): Promise<IHouse[]> {
        const result = await this.houseModel.find().exec();
        return result;
    }
}