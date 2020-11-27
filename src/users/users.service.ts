import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResultErrorEnum, Role } from 'src/shared/dto.models';
import { IUser } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async create(
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    phone: string,
    position: string,
    houseId: string,
  ): Promise<string> {
    let user: IUser;
    if (role === Role.staff) {
      user = new this.userModel({
        firstName: firstName,
        password: '1234',
        lastName: lastName,
        email: email,
        role: role,
        phone: phone,
        position: position,
      });
    } else {
      const sameHouse = (
        await this.userModel.find({ role: role, house: houseId })
      )[0];
      if (sameHouse) return ResultErrorEnum.sameHouse.toString();
      user = new this.userModel({
        firstName: firstName,
        password: '1234',
        lastName: lastName,
        email: email,
        role: role,
        phone: phone,
        house: houseId,
      });
    }
    const result = await user.save();
    return result._id;
  }

  async update(
    _id: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    role?: string,
    phone?: string,
    position?: string,
    houseId?: string,
  ): Promise<string> {
    const user: IUser = (await this.getUsers([_id]))[0];
    if (user) {
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (houseId) user.house = Types.ObjectId(houseId);
      if (phone) user.phone = phone;
      if (position) user.position = position;
      user.save();
      return 'Success';
    } else return ResultErrorEnum.noUser;
  }

  async getUsersForRole(roleEnum: string): Promise<IUser[]> {
    let re: IUser[];
    if (roleEnum === Role.staff) {
      re = await this.userModel.find({ role: roleEnum }).exec();
    } else {
      re = await this.userModel
        .find({ role: roleEnum })
        .populate('house', '-password')
        .exec();
    }
    return re;
  }

  async getUsers(ids: string[]): Promise<IUser[]> {
    return await this.userModel.find({ _id: { $in: ids } });
  }

  async deleteUsers(ids: string[]): Promise<number> {
    const result = await this.userModel.deleteMany({ _id: { $in: ids } });
    return result.deletedCount;
  }

  async deleteAll(): Promise<number> {
    const res = await this.userModel.deleteMany({});
    return res.deletedCount;
  }
}
