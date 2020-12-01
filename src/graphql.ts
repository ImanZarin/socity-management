import { Injectable } from '@nestjs/common';
import { HouseService } from './houses/house.service';
import * as fs from 'fs';
import { UserService } from './users/users.service';
import { Role } from './users/user.model';
import { ResultErrorEnum } from './shared/dto.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildSchema } = require('graphql');

@Injectable()
export class MyGraphql {
  constructor(
    private readonly houseService: HouseService,
    private readonly userService: UserService,
  ) {}

  async guardSigned(req: any) {
    if (!req.nationalNO) throw new Error(ResultErrorEnum.notSigned);
    const user = await this.userService.getUsersByNationalNO(req.nationalNO);
    if (!user) throw Error(ResultErrorEnum.noUser);
  }

  async guardAdmin(req: any) {
    if (!req.nationalNO) throw new Error(ResultErrorEnum.notSigned);
    const user = await this.userService.getUsersByNationalNO(req.nationalNO);
    console.log('first step', user);
    if (!user) throw Error(ResultErrorEnum.noUser);
    if (user.role !== Role.admin) throw Error(ResultErrorEnum.notPermit);
  }

  myRootValue = {
    houses: async () => {
      return this.houseService.getAll();
    },
    createHouse: async (args, req) => {
      await this.guardAdmin(req);
      return this.houseService.create(args.houseInput.no);
    },
    users: async (args, req) => {
      //await guardSigned(req);
      return this.userService.getUsersForRole(args.role);
    },
    login: async args => {
      return this.userService.login(args.nationalNO, args.password);
    },
    createUser: async (args, req) => {
      await this.guardAdmin(req);
      return this.userService.create(
        args.userInput.nationalNO,
        args.userInput.firstName,
        args.userInput.lastName,
        args.userInput.email,
        args.userInput.role,
        args.userInput.phone,
        args.userInput.position,
        args.userInput.houseId,
      );
    },
    updateUser: async (args, req) => {
      await this.guardAdmin(req);
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
    //TODO to be removed
    deleteAllUsers: async () => {
      return await this.userService.deleteAll();
    },
    deleteUser: async (args, req) => {
      await this.guardAdmin(req);
      return this.userService.deleteUsers([args.userId]);
    },
    deleteHouse: async (args, req) => {
      await this.guardAdmin(req);
      return this.houseService.deleteHouses([args.id]);
    },
    vacants: async (args, req) => {
      await this.guardSigned(req);
      return this.houseService.getVacantHouses(args.role);
    },
  };
}

export const myGraphqlSchema = buildSchema(
  fs.readFileSync('./graphql.gql', 'utf8'),
);
