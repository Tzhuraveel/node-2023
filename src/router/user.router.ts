import { Router } from "express";

import { userController } from "../controller/user.controller";
import { ETokenType } from "../enum";
import {
  authMiddleware,
  commonMiddleware,
  fileMiddleware,
} from "../middleware";

const router = Router();

router.get(
  "/",
  authMiddleware.checkToken(ETokenType.ACCESS),
  userController.getAll
);

router.put(
  "/:userId/avatar",
  authMiddleware.checkToken(ETokenType.ACCESS),
  commonMiddleware.isValidId("userId"),
  fileMiddleware.isAvatarValid,
  commonMiddleware.getByIdOrThrow,
  userController.uploadAvatar
);

router.delete(
  "/:userId/avatar/delete",
  authMiddleware.checkToken(ETokenType.ACCESS),
  commonMiddleware.isValidId("userId"),
  commonMiddleware.getByIdOrThrow,
  userController.deleteAvatar
);

export const userRouter = router;
