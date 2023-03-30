import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { userMapper } from "../mapper";
import { IPagination, userService } from "../service";
import { IUser } from "../type";

class UserController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IPagination<IUser>>> {
    try {
      const users = await userService.getAll(req.query);
      const userWithoutField = userMapper.toManyResponse(users);
      return res.json(userWithoutField).status(200);
    } catch (e) {
      next(e);
    }
  }
  public async uploadAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const user = req.res.locals.user as IUser;
      const avatar = req.files.avatar as UploadedFile;

      const updatedUser = await userService.uploadAvatar(avatar, user);

      const response = userMapper.toResponse(updatedUser);

      return res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }
  public async deleteAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const user = req.res.locals.user as IUser;

      await userService.deleteAvatar(user);

      return res.status(204).sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}
export const userController = new UserController();
