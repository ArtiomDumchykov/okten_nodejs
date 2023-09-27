import { NextFunction, Request, Response } from "express";

import { IUser } from "../types";
import { userService } from "../services";

class UserController {
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<Response<IUser[]> | void>  {
        try {
            const users = await userService.getAll();

            return res.json(users);
        } catch (error) {
            next(error)
        }
    }
}

export const userController = new UserController()