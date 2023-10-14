import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";
import { carRepository } from "../repositories";

class CarMiddleware {
  public async getByIdorThrow(req: Request, res: Response, next: NextFunction) {
    try {
      const { carsId } = req.params;

      const car = await carRepository.findById(carsId);

      if (!car) {
        throw new ApiError("Car not found", 404);
      }

      req.res && (req.res.locals = car);

      next();
    } catch (error) {
      next(error);
    }
  }
}

export const carMiddleware = new CarMiddleware();
