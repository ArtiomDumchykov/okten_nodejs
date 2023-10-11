import { Router } from "express";

import { carController } from "../controllers";
import { carMiddleware, commonMiddleware } from "../middlewares";
import { CarValidator } from "../validators";

const router = Router();

router.get("/", carController.getAll);

router.post(
  "/",
  commonMiddleware.isBodyValid(CarValidator.create),
  carController.createCar,
);

router.put(
  "/:carsId",
  commonMiddleware.isIdValid("carsId"),
  carMiddleware.getByIdorThrow,
  commonMiddleware.isBodyValid(CarValidator.update),
  carController.updateCar,
);

router.get(
  "/:carsId",
  commonMiddleware.isIdValid("carsId"),
  carMiddleware.getByIdorThrow,
  carController.getById,
);

router.delete(
  "/:carsId",
  commonMiddleware.isIdValid("carsId"),
  carMiddleware.getByIdorThrow,
  carController.deleteCar,
);

export const carRouter = router;
