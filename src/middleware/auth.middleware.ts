import { NextFunction, Request, Response } from "express";

import { EActionTokenType, ETokenType } from "../enum";
import { ApiError } from "../error";
import { Action, Token } from "../model";
import { tokenService } from "../service";

class AuthMiddleware {
  public checkToken(tokenType: ETokenType) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.get("Authorization");

        if (!token) {
          next(new ApiError("No token", 401));
          return;
        }

        const jwtPayload = tokenService.checkToken(token, tokenType);

        const tokenInfo = await Token.findOne({ [tokenType]: token });

        if (!tokenInfo) {
          next(new ApiError("This token not found", 400));
          return;
        }

        req.res.locals.token = { jwtPayload, tokenInfo };

        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public checkActionToken(tokenType: EActionTokenType) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const actionToken = req.params.token;

        if (!actionToken) {
          next(new ApiError("No token", 401));
          return;
        }

        const jwtPayload = tokenService.checkToken(actionToken, tokenType);

        const tokenInfo = await Action.findOne({ actionToken });

        if (!tokenInfo) {
          next(new ApiError("Token not found", 400));
          return;
        }

        req.res.locals.token = { jwtPayload, tokenInfo };

        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();
