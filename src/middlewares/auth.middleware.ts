import { NextFunction, Request, Response } from 'express';

import { ITokenType } from '../types';
import { ApiError } from '../errors';
import { tokenService } from '../services';
import { tokenRepository } from '../repositories';
class AuthMiddleware {
    private async checkToken(req: Request, res: Response, next: NextFunction, tokenType: ITokenType) {
        try {
            const token = req.get('Authorization');

            if (!token) {
                throw new ApiError('No Token!!!', 401);
            }

            const payload = tokenService.checkToken(token, tokenType);

            const entity = await tokenRepository.findOne({ [`${tokenType}Token`]: token });

            if (!entity) {
                throw new ApiError('Token not valid', 401);
            }

            if (req.res) {
                req.res.locals.tokenPayload = payload;
                req.res.locals[`${tokenType}Token`] = token;

            }

            next();
        } catch (error) {
            next(error);
        }
    }

    public checkAccessToken = async (req: Request, res: Response, next: NextFunction) => {
        this.checkToken(req, res, next, 'access');
    }

    public checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
        this.checkToken(req, res, next, 'refresh');
    }
}

export const authMiddleware = new AuthMiddleware()

