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
}
exports.userRepository = new UserRepository();
