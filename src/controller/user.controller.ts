import { NextFunction, Request, Response } from "express";

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
      return res.json(users).status(200);
    } catch (e) {
      next(e);
    }
  }
}
export const userController = new UserController();
