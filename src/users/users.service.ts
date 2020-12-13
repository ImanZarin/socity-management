import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LoggedinUser, ResultErrorEnum } from 'src/shared/dto.models';
import { IUser, Role } from './user.model';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UserService {
  async login(nationalNO: string, password: string): Promise<LoggedinUser> {
    const user = await this.getUsersByNationalNO(nationalNO);
    if (!user) throw new Error(ResultErrorEnum.noId);
    let allowed = false;
    if (user.role === Role.admin && user.password === password) allowed = true;
    else allowed = await compare(password, user.password);
    if (!allowed) throw new Error(ResultErrorEnum.wrongPass);
    const accessToken = sign(
      { nationalNO: nationalNO, phone: user.phone },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRE_TIME },
    );
    return { user: user, accessToken: accessToken };
  }
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async create(
    nationalNO: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    phone: string,
    position: string,
    houseId: string,
  ): Promise<string> {
    if (role === Role.owner || role === Role.tenant) {
      const sameHouse = (
        await this.userModel.find({ role: role, house: houseId })
      )[0];
      if (sameHouse) return ResultErrorEnum.sameHouse.toString();
    }
    const hashedPass = await hash(phone.substr(phone.length - 4), 10);
    const user: IUser = new this.userModel({
      nationalNO: nationalNO,
      firstName: firstName,
      password: hashedPass,
      lastName: lastName,
      email: email,
      role: role,
      phone: phone,
      position: position,
      house: houseId,
    });
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

  async getUsersByNationalNO(id: string): Promise<IUser> {
    const user = await this.userModel
      .findOne({ nationalNO: id })
      .populate('house', '-password');
    return user;
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
