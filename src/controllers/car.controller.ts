import { Request, Response, NextFunction } from 'express';

import { ICar } from '../types';
import { carService } from '../services';
class CarController {

    public async getAll(req: Request, res: Response, next: NextFunction): Promise<Response<ICar[]> | void> {
        try {
            const cars = await carService.getAll();

            return res.json(cars);
        } catch (error) {
            next(error);
        }
    }


    public async createCar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const car = await carService.createCar(req.body);

            res.status(201).json(car);
        } catch (error) {
            next(error);
        }
    }

    public async updateCar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const car = await carService.updateCar(req.params.carsId, req.body);

            res.status(201).json(car);
        } catch (error) {
            next(error)
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const car = req.res?.locals;

            res.json(car);
        } catch (error) {
            next(error)
        }
    }

    public async deleteCar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await carService.deleteCar(req.params.carsId);

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }


}

export const carController = new CarController()