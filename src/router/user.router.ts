import { Router } from "express";

import { userController } from "../controller/user.controller";
import { ETokenType } from "../enum";
import { authMiddleware } from "../middleware";

const router = Router();

router.get(
  "/",
  authMiddleware.checkToken(ETokenType.ACCESS),
  userController.getAll
);

export const userRouter = router;
