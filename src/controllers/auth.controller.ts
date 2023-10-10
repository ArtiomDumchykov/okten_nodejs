import { NextFunction, Request, Response } from 'express';

import { ITokenPayload, ITokensPair } from '../types';
import { authService } from '../services';
class AuthController {
    public async register(req: Request, res: Response, next: NextFunction): Promise<Response<void> | void> {
        try {
            await authService.register(req.body);

            return res.sendStatus(201);
        } catch (error) {
            next(error)
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<Response<ITokensPair> | void> {
        try {
            const tokensPair = await authService.login(req.body);

            return res.json(tokensPair);
        } catch (error) {
            next(error)
        }
    }

    public async refresh(req: Request, res: Response, next: NextFunction): Promise<Response<ITokensPair> | void> {
        try {
            const tokenPayload: ITokenPayload = req.res?.locals.tokenPayload;
            const refreshToken: string = req.res?.locals.refreshToken;

            const tokensPair = await authService.refresh(tokenPayload, refreshToken);

            return res.status(201).json(tokensPair);
        } catch (error) {
            next(error);
        }
    }

    public async logout(req: Request, res: Response, next: NextFunction): Promise<Response<void> | void> {
        try {
            
            const accessToken = req.res?.locals.accessToken as string

            await authService.logout(accessToken)

            return res.sendStatus(204)
        } catch (error) {
            next(error);
        }
    }

    public async logoutAll(req: Request, res: Response, next: NextFunction): Promise<Response<void> | void> {
        try {
            
            const tokenPayload: ITokenPayload = req.res?.locals.tokenPayload;

            await authService.logoutAll(tokenPayload.userId.toString())

            return res.sendStatus(204)
        } catch (error) {
            next(error);
        }
    }


}

export const authController = new AuthController();