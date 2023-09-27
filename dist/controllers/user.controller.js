"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const services_1 = require("../services");
class UserController {
    async getAll(req, res, next) {
        try {
            const users = await services_1.userService.getAll();
            return res.json(users);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.userController = new UserController();
