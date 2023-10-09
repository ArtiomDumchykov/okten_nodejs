import { FilterQuery } from "mongoose";

import { IUser, IUserCredentials } from "../types";
import { User } from "../models";
class UserRepository {
    public async getAll(): Promise<IUser[]> {
        return await User.find()
    }

    public async findById(id: string): Promise<IUser | null> {
        return await User.findById(id)
    }

    public async getOneByParams(params: FilterQuery<IUser>): Promise<IUser | null> {
        return await User.findOne(params);
    }

    public async register(dto: IUserCredentials): Promise<IUser> {
        return await User.create(dto);
    }

    public async deleteUser(userId: string): Promise<void> {
        await User.deleteOne({_id: userId});
    }

    public async updateUser(userId: string, dto: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(userId, dto, {
            returnDocument: "after",
        })
    }
}

export const userRepository = new UserRepository();