import { FilterQuery } from "mongoose";

import { IUser } from "../types";
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

    public async createUser(dto: IUser): Promise<IUser> {
        // return await User.create(dto) 
        return await User.create(dto) as IUser;
        // const user = await User.create(dto);
        // return user.toObject() as IUser;
    }

    public async deleteUser(userId: string): Promise<void> {
        await User.deleteOne({_id: userId})
    }

    public async updateUser(userId: string, dto: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(userId, dto, {
            returnDocument: "after",
        })
    }
}

export const userRepository = new UserRepository()