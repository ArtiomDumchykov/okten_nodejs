import { Router } from "express";

import { commonMiddleware } from "../middlewares";
import { UserValidator } from "../validators";
import { authController } from "../controllers";

const router = Router();

router.post(
    '/register',
    commonMiddleware.isBodyValid(UserValidator.register),
    // write middleware for validating is user with provided email exists
    authController.register,
)

router.post(
    '/login',
    authController.login
)


export const authRouter = router