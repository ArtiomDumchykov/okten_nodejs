import { NextFunction, Request, Response } from "express";

import { ITokensPair } from "../types";
import { authService } from "../services";


class AuthController {
    public async register (req: Request, res: Response, next: NextFunction): Promise<Response<void> | void> {
        try {
            await authService.register(req.body);

            return res.sendStatus(201);
        } catch (error) {
            next(error)
        }
    }

    public async login (req: Request, res: Response, next: NextFunction): Promise<Response<ITokensPair> | void> {
        try {
           const tokensPair = await authService.login(req.body)

            return res.json(tokensPair)
        } catch (error) {
            next(error)
        }
    }

    
}

export const authController = new AuthController()