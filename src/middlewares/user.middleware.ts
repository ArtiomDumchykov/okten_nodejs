import { NextFunction, Request, Response, } from 'express';
import { userRepository } from '../repositories';
// import mongoose from 'mongoose';
// import { ObjectSchema } from 'joi';

import { ApiError } from '../errors';


class UserMiddleware {
    public async getByIdOrThrow (req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params

            const user = await userRepository.findById(userId);

            if (!user) {
                throw new ApiError("user not found", 404)
            }

            req?.res && (req.res.locals = user);

            next()
        } catch (error) {
            next(error)
        }
    }
}

export const userMiddleware = new UserMiddleware()