"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const repositories_1 = require("../repositories");
class UserService {
    async getAll() {
        const users = await repositories_1.userRepository.getAll();
        return users;
    }
}
exports.userService = new UserService();
