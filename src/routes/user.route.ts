import { Router } from "express";

import { userController } from "../controllers";
import {
  authMiddleware,
  commonMiddleware,
  userMiddleware,
} from "../middlewares";
import { UserValidator } from "../validators";

const router = Router();

router.get("/", userController.getAll);

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userMiddleware.getByIdOrThrow,
  userController.getById,
);

router.delete(
  "/:userId",
  authMiddleware.checkAccessToken,
  // authMiddleware.checkAuthToken("access"),
  commonMiddleware.isIdValid("userId"),
  userMiddleware.getByIdOrThrow,
  userController.deleteUser,
);

router.put(
  "/:userId",
  authMiddleware.checkAccessToken,
  // authMiddleware.checkAuthToken("access"),
  commonMiddleware.isIdValid("userId"),
  userMiddleware.getByIdOrThrow,
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.updateUser,
);

export const userRouter = router;
