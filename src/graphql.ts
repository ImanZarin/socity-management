import { Injectable } from "@nestjs/common";
import { HouseService } from "./houses/house.service";
import * as fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildSchema } = require('graphql');

@Injectable()
export class MyGraphql {
  constructor(private readonly houseService: HouseService) {

  }


  myRootValue = {
    houses: () => {
      return this.houseService.getAll();
    },
    createHouse: (args) => {
      return this.houseService.create(args.houseInput.no);
    }
  }
}

export const myGraphqlSchema = buildSchema(fs.readFileSync('./graphql.gql','utf8'));
