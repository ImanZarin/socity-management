import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ElectionUserService } from 'src/electionuser/electionuser.service';
import { IElectionUser } from 'src/electionuser/electionusers.model';
import { ResultErrorEnum } from 'src/shared/dto.models';
import { IUser } from 'src/users/user.model';
import { ElectionOption, IElection } from './election.model';

@Injectable()
export class ElectionService {
  constructor(
    @InjectModel('Election') private readonly electionModel: Model<IElection>,
    private readonly electionuserService: ElectionUserService,
  ) {}

  async create(
    title: string,
    start: string,
    end: string,
    options: ElectionOption[],
    hasImg?: boolean,
  ): Promise<string> {
    const names = options.map(o => o.name);
    const namesReduced = [...new Set(names)];
    if (namesReduced.length < options.length)
      throw new Error(ResultErrorEnum.repetedOption);
    const el = new this.electionModel({
      title: title,
      start: start,
      end: end,
      options: options,
      hasImg: hasImg,
    });
    el.save();
    return el._id;
  }

  async getAll(): Promise<IElection[]> {
    await this.updateOngoingElections();
    return (await this.electionModel.find().exec()).sort((a, b) =>
      a.start > b.start ? -1 : 1,
    );
  }

  async delete(id: string): Promise<number> {
    return await (await this.electionModel.deleteOne({ _id: id })).deletedCount;
  }

  async updateOngoingElections(): Promise<IElection[]> {
    const elections = (await this.electionModel.find().exec()).filter(
      el => new Date(el.start) < new Date() && new Date() < new Date(el.end),
    );
    for (const election of elections) {
      const votes = await this.electionuserService.getForElection(election._id);
      await this.updateResult(election, votes);
    }
    return elections;
  }

  async updateResult(election: IElection, votes: IElectionUser[]) {
    const allVote = votes.length;
    const updatesOptions: ElectionOption[] = election.options.map(op => {
      return {
        ...op,
        percent:
          Math.round(
            (votes.filter(o => o.vote === op.name).length / allVote) * 100),
      };
    });
    election.options = updatesOptions;
    await election.save();
  }

  async getCurrentElectionAndVote(
    user: IUser,
  ): Promise<{ elections: IElection[]; votes: IElectionUser[] }> {
    const allElections = await this.updateOngoingElections();
    const myVotes = await this.electionuserService.getForUser(user._id);
    return {elections: allElections, votes: myVotes};
  }

  async isAcceptedOption(electionId: string, vote: string): Promise<boolean> {
    const el = await this.electionModel.findById(electionId);
    return el.options.map(op => op.name).includes(vote);
  }
}
