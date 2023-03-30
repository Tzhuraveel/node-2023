import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { EDynamicallyAction } from "../enum";
import { ApiError } from "../error";
import { User } from "../model";
import { userService } from "../service";

class CommonMiddleware {
  public isValidBody(validator: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error, value } = validator.validate(req.body);

        if (error) return next(new ApiError(error.message, 400));

        req.body = value;

        next();
      } catch (e) {
        next(e);
      }
    };
  }
  public isValidId(idField: string, from: "params" | "query" = "params") {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!isObjectIdOrHexString(req[from][idField])) {
          next(new ApiError("Id not valid", 400));
          return;
        }
        req.res.locals.id = req[from][idField];
        next();
      } catch (e) {
        next(e);
      }
    };
  }
  public async getByIdOrThrow(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);

      if (!user) {
        throw new ApiError("User not found", 422);
      }

      res.locals.user = user;
      next();
    } catch (e) {
      next(e);
    }
  }
  public getDynamicallyAndCheckExistence(
    actionWithFoundField: EDynamicallyAction,
    field: string,
    from: "body" | "query" | "params" = "body",
    dbField = field
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const fieldFromBody = req[from][field];

        const foundItem = await userService.getByField(dbField, fieldFromBody);

        switch (actionWithFoundField) {
          case EDynamicallyAction.THROW:
            if (foundItem) {
              next(new ApiError(`${fieldFromBody} already exist`, 400));
              return;
            }
            break;
          case EDynamicallyAction.NEXT:
            if (!foundItem) {
              next(new ApiError("Not found user", 400));
              return;
            }
            req.res.locals.user = foundItem;
            break;
        }

        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
