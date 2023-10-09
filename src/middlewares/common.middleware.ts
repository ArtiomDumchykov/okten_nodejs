import { NextFunction, Request, Response, } from 'express';
import mongoose from 'mongoose';
import { ObjectSchema } from 'joi';

import { ApiError } from '../errors';
class CommonMiddleware {
    public isIdValid(field: string) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = req.params[field];

                if (!mongoose.isObjectIdOrHexString(id)) {
                    throw new ApiError('Not valid ID', 400);
                }

                next();
            } catch (error) {
                next(error);
            }
        }
    }

    public isBodyValid(validator: ObjectSchema) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const {error, value} = validator.validate(req.body);
                
                if (error) {
                    throw new ApiError(error.message, 400);
                }

                req.body = value;
                next();
            } catch (error) {
                next(error);
            }
        }
    }
}

export const commonMiddleware = new CommonMiddleware();