import { Injectable } from '@nestjs/common';
import { HouseService } from './houses/house.service';
import * as fs from 'fs';
import { UserService } from './users/users.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildSchema } = require('graphql');

@Injectable()
export class MyGraphql {
  constructor(
    private readonly houseService: HouseService,
    private readonly userService: UserService,
  ) {}

  myRootValue = {
    houses: async () => {
      return this.houseService.getAll();
    },
    createHouse: async args => {
      return this.houseService.create(args.houseInput.no);
    },
    users: async args => {
      return this.userService.getUsersForRole(args.role);
    },
    createUser: async args => {
      return this.userService.create(
        args.userInput.firstName,
        args.userInput.lastName,
        args.userInput.email,
        args.userInput.role,
        args.userInput.phone,
        args.userInput.position,
        args.userInput.houseId,
      );
    },
    updateUser: async args => {
      return this.userService.update(
        args.userInput._id,
        args.userInput.firstName,
        args.userInput.lastName,
        args.userInput.email,
        args.userInput.role,
        args.userInput.phone,
        args.userInput.position,
        args.userInput.houseId,
      );
    
    },
    deleteAllUsers: async () => {
      return this.userService.deleteAll();
    },
    deleteUser: async args => {
      return this.userService.deleteUsers([args.userId]);
    },
    deleteHouse: async args => {
      return this.houseService.deleteHouses([args.id]);
    },
    vacants: async args => {
      return this.houseService.getVacantHouses(args.role);
    },
  };
}

export const myGraphqlSchema = buildSchema(
  fs.readFileSync('./graphql.gql', 'utf8'),
);
