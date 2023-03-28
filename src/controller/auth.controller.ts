import { NextFunction, Request, Response } from "express";

import { EActionTokenType, EEmailAction } from "../enum";
import { authService } from "../service";
import { ITokenPair, IUser } from "../type";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const user = await authService.register(req.body);

      return res.json(user).status(201);
    } catch (e) {
      next(e);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ITokenPair>> {
    try {
      const { user } = req.res.locals;
      const { password } = req.body;

      const tokenPair = await authService.login(user, password);

      return res.json(tokenPair);
    } catch (e) {
      next(e);
    }
  }
  public async sendActivateToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user } = req.res.locals;

      await authService.sendActionToken(
        user,
        EActionTokenType.ACTIVATE,
        EEmailAction.ACTIVATE
      );

      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
  public async activate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { jwtPayload, tokenInfo } = req.res.locals.token;

      await authService.activate(jwtPayload._id, tokenInfo);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
  public async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<string>> {
    try {
      const { oldPassword, newPassword } = req.body;
      const { tokenInfo } = req.res.locals.token;

      await authService.changePassword(
        tokenInfo._user_id,
        oldPassword,
        newPassword
      );

      return res.status(200).json("Password changed");
    } catch (e) {
      next(e);
    }
  }

  public async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<string>> {
    try {
      const { user } = req.res.locals;

      await authService.forgotPassword(user);

      return res.status(200).json("Message was sent to the specified email");
    } catch (e) {
      next(e);
    }
  }
  public async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ITokenPair>> {
    try {
      const { jwtPayload, tokenInfo } = req.res.locals.token;

      const tokenPair = await authService.refresh(jwtPayload, tokenInfo);

      return res.json(tokenPair).status(200);
    } catch (e) {
      next(e);
    }
  }
  public async updateForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<string>> {
    try {
      const { tokenInfo } = req.res.locals.token;
      const { password } = req.body;

      await authService.updateForgotPassword(password, tokenInfo);

      return res
        .status(200)
        .json("You can sign in to your account with a new password");
    } catch (e) {
      next(e);
    }
  }
}
export const authController = new AuthController();
