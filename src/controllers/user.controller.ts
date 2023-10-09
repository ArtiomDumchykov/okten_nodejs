import { NextFunction, Request, Response } from 'express';

import { IUser } from '../types';
import { userService } from '../services';
class UserController {
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<Response<IUser[]> | void> {
        try {
            const users = await userService.getAll();

            return res.json(users);
        } catch (error) {
            next(error);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.res?.locals;

            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await userService.deleteUser(req.params.userId);

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

    public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await userService.updateUser(req.params.userId, req.body);

            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController();