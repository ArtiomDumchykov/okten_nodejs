"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const repositories_1 = require("../repositories");
const errors_1 = require("../errors");
class UserService {
    async getAll() {
        const users = await repositories_1.userRepository.getAll();
        return users;
    }
    async createUser(dto) {
        const user = await repositories_1.userRepository.getOneByParams({ email: dto.email });
        if (user) {
            throw new errors_1.ApiError("Email already exist", 409);
        }
        return await repositories_1.userRepository.createUser(dto);
    }
    async deleteUser(userId) {
        await repositories_1.userRepository.deleteUser(userId);
    }
    async updateUser(userId, dto) {
        return await repositories_1.userRepository.updateUser(userId, dto);
    }
}
exports.userService = new UserService();
