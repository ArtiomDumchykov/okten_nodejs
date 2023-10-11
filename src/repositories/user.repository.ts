import { FilterQuery } from "mongoose";

import { IUser, IUserCredentials } from "../types";
import { User } from "../models";
import { EUserStatus } from "../enums";
class UserRepository {
    public async getAll(): Promise<IUser[]> {
        return await User.find()
    }

    public async getOneByParams(params: FilterQuery<IUser>): Promise<IUser | null> {
        return await User.findOne(params);
    }

    public async findById(id: string): Promise<IUser | null> {
        return await User.findById(id)
    }

    public async register(dto: IUserCredentials): Promise<IUser> {
        return await User.create(dto);
    }

    public async updateUser(userId: string, dto: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(userId, dto, {
            returnDocument: "after",
        })
    }

    public async setStatus(userId: string, status: EUserStatus): Promise<void> {
        await User.updateMany({ _id: userId }, {$set: {status}})
    }

    public async deleteUser(userId: string): Promise<void> {
        await User.deleteOne({_id: userId});
    }
}

export const userRepository = new UserRepository();