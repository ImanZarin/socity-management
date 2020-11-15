import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HouseSchema } from "./house.model";
import { HouseService } from "./house.service";



@Module({
    imports: [MongooseModule.forFeature([{ name: "House", schema: HouseSchema }])],
    controllers: [],
    providers: [HouseService],
    exports: [HouseService]
})
export class HouseModule { }