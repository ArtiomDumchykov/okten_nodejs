"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const models_1 = require("../models");
class UserRepository {
    async getAll() {
        return await models_1.User.find();
    }
    async findById(id) {
        return await models_1.User.findById(id);
    }
    async getOneByParams(params) {
        return await models_1.User.findOne(params);
    }
    async createUser(dto) {
        return await models_1.User.create(dto);
    }
    async deleteUser(userId) {
        await models_1.User.deleteOne({ _id: userId });
    }
    async updateUser(userId, dto) {
        return await models_1.User.findByIdAndUpdate(userId, dto, {
            returnDocument: "after",
        });
    }
}
exports.userRepository = new UserRepository();
