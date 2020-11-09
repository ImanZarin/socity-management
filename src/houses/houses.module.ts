import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HouseSchema } from "./house.model";



@Module({
    imports: [MongooseModule.forFeature([{ name: "House", schema: HouseSchema }])],
    controllers: [],
    providers: [],
    exports: []
})
export class HouseModule { }