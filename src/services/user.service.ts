import { userRepository } from "../repositories";
import { IUser } from "../types";

class UserService {
  public async getAll(): Promise<IUser[]> {
    const users = await userRepository.getAll();

    return users;
  }

  public async deleteUser(userId: string): Promise<void> {
    await userRepository.deleteUser(userId);
  }

  public async updateUser(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await userRepository.updateUser(userId, dto);
  }

  public async getMe(userId: string): Promise<IUser> {
    return await userRepository.findById(userId);
  }
}

export const userService = new UserService();
