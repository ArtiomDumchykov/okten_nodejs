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
    async createUser(req, res, next) {
        try {
            const user = await services_1.userService.createUser(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const user = req.res?.locals;
            res.json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteUser(req, res, next) {
        try {
            await services_1.userService.deleteUser(req.params.userId);
            res.sendStatus(204);
        }
        catch (error) {
            next(error);
        }
    }
    async updateUser(req, res, next) {
        try {
            const user = await services_1.userService.updateUser(req.params.userId, req.body);
            res.status(201).json(user);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.userController = new UserController();
