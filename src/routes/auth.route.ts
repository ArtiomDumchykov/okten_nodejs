import { Router } from 'express';

import { authMiddleware, commonMiddleware, userMiddleware } from '../middlewares';
import { authController } from '../controllers';
import { UserValidator } from '../validators';

const router = Router();

router.post(
    '/register',
    commonMiddleware.isBodyValid(UserValidator.register),
    userMiddleware.isEmailUniq,
    authController.register,
)

router.post(
    '/login',
    commonMiddleware.isBodyValid(UserValidator.login),
    authController.login,
)

router.post(
    '/refresh',
    authMiddleware.checkRefreshToken,
    authController.refresh,
)


export const authRouter = router