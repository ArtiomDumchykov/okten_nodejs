import { NextFunction, Request, Response } from "express";

// import mongoose from 'mongoose';
// import { ObjectSchema } from 'joi';
import { ApiError } from "../errors";
import { userRepository } from "../repositories";

class UserMiddleware {
  public async getByIdOrThrow(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const user = await userRepository.findById(userId);

      if (!user) {
        throw new ApiError("user not found", 404);
      }

      req?.res && (req.res.locals = user);

      next();
    } catch (error) {
      next(error);
    }
  }

  public async isEmailUniq(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user = await userRepository.getOneByParams({ email });

      if (user) {
        throw new ApiError("Email already exist", 409);
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}

export const userMiddleware = new UserMiddleware();
