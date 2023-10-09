import { ICar } from '../types';
import { carRepository } from '../repositories';
class CarService {
    public async getAll(): Promise<ICar[]> {
        const cars = await carRepository.getAll();

        return cars;
    }

    public async createCar(dto: ICar): Promise<ICar> {
        return await carRepository.createCar(dto);
    }

    public async updateCar(carsId: string, dto: ICar): Promise<ICar | null> {
        return await carRepository.updateCar(carsId, dto);
    }

    public async deleteCar(carsId: string): Promise<void> {
        await carRepository.deleteCar(carsId);
    }
}

export const carService = new CarService();