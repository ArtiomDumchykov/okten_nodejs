import { Router } from "express";

import { userController } from "../controllers";

const router = Router();

router.get('/', userController.getAll);

export const userRouter = router;