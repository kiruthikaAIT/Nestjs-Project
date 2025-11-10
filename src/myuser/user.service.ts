import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Model } from "mongoose";

@Injectable()
export class Userservice{
      constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    // getUsers(){
    //     return ['kiruthika', 'monika']
    // }


    async create(data: Partial<User>): Promise<User> {
        console.log("post data",data);
    const user = new this.userModel(data);
    return user.save();
    }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updatePartial(id: string, data: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }

}