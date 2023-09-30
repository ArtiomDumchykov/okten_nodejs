import { ICar } from "../types";
import { Car } from "../models";

class CarRepository {
    public async getAll(): Promise<ICar[]> {
        return await Car.find();
    }

    public async findById(id: string): Promise<ICar | null> {
        return await Car.findById(id);
    }

    public async createCar(dto: ICar): Promise<ICar> {
        return await Car.create(dto);
    }

    public async updateCar(carsId: string, dto: ICar): Promise<ICar | null> {
        return await Car.findByIdAndUpdate(carsId, dto, {
            returnDocument: "after",
        })
    }

    public async deleteCar(carsId: string): Promise<void> {
        await Car.deleteOne({_id: carsId})
    }
}

export const carRepository = new CarRepository()