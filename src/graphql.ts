import { Injectable } from '@nestjs/common';
import { HouseService } from './houses/house.service';
import * as fs from 'fs';
import { UserService } from './users/users.service';
import { IUser, Role } from './users/user.model';
import { LoggedinUser, ResultErrorEnum } from './shared/dto.models';
import { ElectionService } from './elections/election.service';
import { ElectionOption, IElection } from './elections/election.model';
import { ElectionUserService } from './electionuser/electionuser.service';
import { IElectionUser } from './electionuser/electionusers.model';
import { DocService } from './docs/docs.service';
import { IDoc, TransferringDoc } from './docs/doc.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildSchema } = require('graphql');

@Injectable()
export class MyGraphql {
  constructor(
    private readonly houseService: HouseService,
    private readonly userService: UserService,
    private readonly electionService: ElectionService,
    private readonly electionuserService: ElectionUserService,
    private readonly docService: DocService,
  ) {}

  async guardSigned(req: any): Promise<IUser> {
    if (!req.nationalNO) throw new Error(ResultErrorEnum.notSigned);
    const user = await this.userService.getUsersByNationalNO(req.nationalNO);
    if (!user) throw Error(ResultErrorEnum.noUser);
    else return user;
  }

  async guardAdmin(req: any): Promise<IUser> {
    if (!req.nationalNO) throw new Error(ResultErrorEnum.notSigned);
    const user = await this.userService.getUsersByNationalNO(req.nationalNO);
    if (!user) throw Error(ResultErrorEnum.noUser);
    if (user.role !== Role.admin) throw Error(ResultErrorEnum.notPermit);
    else return user;
  }

  async guardOwner(req: any): Promise<IUser> {
    if (!req.nationalNO) throw new Error(ResultErrorEnum.notSigned);
    const user = await this.userService.getUsersByNationalNO(req.nationalNO);
    if (!user) throw Error(ResultErrorEnum.noUser);
    if (user.role !== Role.owner) throw Error(ResultErrorEnum.notPermit);
    else return user;
  }

  myRootValue = {
    houses: async () => {
      return this.houseService.getAll();
    },
    createHouse: async (args, req) => {
      //await this.guardAdmin(req);
      return this.houseService.create(args.houseInput.no);
    },
    users: async (args, req) => {
      //await guardSigned(req);
      return this.userService.getUsersForRole(args.role);
    },
    user: async (args, req) => {
      console.log('user is: ', req.nationalNO);
      const u = await this.guardSigned(req);
      return u;
    },
    login: async (args): Promise<LoggedinUser> => {
      return this.userService.login(args.nationalNO, args.password);
    },
    createUser: async (args, req) => {
      //await this.guardAdmin(req);
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
      //await this.guardAdmin(req);
      return this.userService.deleteUsers([args.userId]);
    },
    deleteHouse: async (args, req) => {
      await this.guardAdmin(req);
      return this.houseService.deleteHouses([args.id]);
    },
    vacants: async (args, req) => {
      //await this.guardSigned(req);
      return this.houseService.getVacantHouses(args.role);
    },
    elections: async (args, req): Promise<IElection[]> => {
      //await this.guardAdmin(req);
      return this.electionService.getAll();
    },
    createElection: async (args, req): Promise<string> => {
      //await this.guardAdmin(req);
      return this.electionService.create(
        args.election.title,
        args.election.start,
        args.election.end,
        args.election.options,
        args.election.hasImg,
      );
    },
    deleteElection: async (args, req): Promise<number> => {
      //await this.guardAdmin(req);
      return this.electionService.delete(args.id);
    },
    updateVote: async (
      args,
      req,
    ): Promise<{ elections: IElection[]; votes: IElectionUser[] }> => {
      const user = await this.guardOwner(req);
      const myVote = await this.electionuserService.alreadyVoted(
        args.voteInput.electionId,
        user._id,
      );
      const isOption = await this.electionService.isAcceptedOption(
        args.voteInput.electionId,
        args.voteInput.vote,
      );
      if (!isOption) throw new Error(ResultErrorEnum.noOption);
      if (myVote)
        await this.electionuserService.update(myVote._id, args.voteInput.vote);
      else
        await this.electionuserService.create(
          user._id,
          args.voteInput.electionId,
          args.voteInput.vote,
        );
      return await this.electionService.getCurrentElectionAndVote(user);
    },
    vote: async (
      args,
      req,
    ): Promise<{ elections: IElection[]; votes: IElectionUser[] }> => {
      const user = await this.guardOwner(req);
      return await this.electionService.getCurrentElectionAndVote(user);
    },
    deleteVote: async (args, req): Promise<number> => {
      return await this.electionuserService.delete(args.id);
    },
    votes: async (args, req): Promise<IElectionUser[]> => {
      return await this.electionuserService.getForElection(args.electionId);
    },
    createAndUpdateDoc: async (args, req): Promise<string> => {
      return await this.docService.createAndUpdate(
        args.docInput.title,
        args.docInput.description,
        args.docInput.image,
        args.docInput.id,
        args.docInput.duration,
      );
    },
    docs: async (args, req): Promise<TransferringDoc[]> => {
      return await this.docService.getRecent(args.last);
    },
    doc: async (args, req): Promise<TransferringDoc> => {
      return await this.docService.getOne(args.docId);
    },
    deleteDoc: async (args, req): Promise<boolean> => {
      return await this.docService.delete(args.id);
    }
  };
}

export const myGraphqlSchema = buildSchema(
  fs.readFileSync('./graphql.gql', 'utf8'),
);
