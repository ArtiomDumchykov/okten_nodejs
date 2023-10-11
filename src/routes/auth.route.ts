import { Router } from "express";

import { authController } from "../controllers";
import { commonMiddleware } from "../middlewares";
import { UserValidator } from "../validators";

const router = Router();

router.post(
  "/register",
  commonMiddleware.isBodyValid(UserValidator.register),
  // write middleware for validating is user with provided email exists
  authController.register,
);

router.post("/login", authController.login);

export const authRouter = router;
