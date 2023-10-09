import { IUser } from '../types';
import { userRepository } from '../repositories';
class UserService {
    public async getAll(): Promise<IUser[]> {
        const users = await userRepository.getAll();
        
        return users;
    }

    public async deleteUser(userId: string): Promise<void> {
        await userRepository.deleteUser(userId);
    }

    public async updateUser(userId: string, dto: Partial<IUser>): Promise<IUser | null> {
        return await userRepository.updateUser(userId, dto);
    }
}

export const userService = new UserService();