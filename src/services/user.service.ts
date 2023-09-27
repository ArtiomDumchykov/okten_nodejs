import { IUser } from "../types";
import { userRepository } from "../repositories";

class UserService {
    public async getAll(): Promise<IUser[]> {
        const users = await userRepository.getAll();
        return users;
    }
}

export const userService = new UserService();