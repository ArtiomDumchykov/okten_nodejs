import { IUser } from "../types";
import { userRepository } from "../repositories";
import { ApiError } from "../errors";

class UserService {
    public async getAll(): Promise<IUser[]> {
        const users = await userRepository.getAll();
        return users;
    }

    public async createUser(dto: IUser): Promise<IUser> {
        const user = await userRepository.getOneByParams({email: dto.email});

        if (user) {
            throw new ApiError("Email already exist", 409)
        }
        return await userRepository.createUser(dto)
    }

    public async deleteUser(userId: string): Promise<void> {
        await userRepository.deleteUser(userId)
    }

    public async updateUser(userId: string, dto: Partial<IUser>): Promise<IUser | null> {
        return await userRepository.updateUser(userId, dto)
    }
}

export const userService = new UserService();