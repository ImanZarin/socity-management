import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IElectionUser } from './electionusers.model';

@Injectable()
export class ElectionUserService {
  constructor(
    @InjectModel('ElectionUser')
    private readonly electionuserModel: Model<IElectionUser>,
  ) {}

  async create(
    userId: string,
    electionId: string,
    vote: string,
  ): Promise<string> {
    const newEU : IElectionUser = new this.electionuserModel({
      userId: userId,
      electionId: electionId,
      vote: vote,
    });
    const result = await newEU.save();
    return result._id;
  }

  async update(id: string, newVote: string): Promise<IElectionUser> {
    const eu = await this.electionuserModel.findById({ _id: id });
    eu.vote = newVote;
    return await eu.save();
  }

  async getForElection(electionId: string): Promise<IElectionUser[]> {
    return await this.electionuserModel.find({ electionId: electionId });
  }

  async getForUser(userId: string): Promise<IElectionUser[]> {
    return await this.electionuserModel.find({ userId: userId });
  }

  async alreadyVoted(electionId: string, userId: string): Promise<IElectionUser | undefined> {
    const eu = await this.electionuserModel.findOne({
      electionId: electionId,
      userId: userId,
    });
    return eu;
  }

  async delete(id: string): Promise<number> {
    return await (await this.electionuserModel.deleteOne({_id: id})).deletedCount;
  }

}
