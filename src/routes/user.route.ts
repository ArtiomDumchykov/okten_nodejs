import { Router } from "express";

import { userController } from "../controllers";
import { commonMiddleware, userMiddleware } from "../middlewares";
import { UserValidator } from "../validators";

const router = Router();

router.get("/", userController.getAll);

// router.post(
//     '/',
//     commonMiddleware.isBodyValid(UserValidator.register),
//     userController.createUser,
// )

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userMiddleware.getByIdOrThrow,
  userController.getById,
);

router.delete(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userMiddleware.getByIdOrThrow,
  userController.deleteUser,
);

router.put(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userMiddleware.getByIdOrThrow,
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.updateUser,
);

export const userRouter = router;
