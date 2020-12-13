import { Document, Schema } from "mongoose";
import { IElection } from "src/elections/election.model";
import { IUser } from "src/users/user.model";

export interface IElectionUser extends Document {
    _id: string;
    electionId: string | IElection;
    userId: string | IUser;
    vote: string;
}

export const ElectionUserSchema = new Schema({
    electionId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    vote: {
        type: String,
        required: true
    }
});