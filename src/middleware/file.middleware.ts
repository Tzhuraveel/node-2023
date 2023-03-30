import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { avatarConfig } from "../config";
import { ApiError } from "../error";

class FileMiddleware {
  public async isAvatarValid(req: Request, res: Response, next: NextFunction) {
    try {
      const { avatar } = req.files;

      if (!req.files) {
        next(new ApiError("No files to upload", 400));
        return;
      }

      if (Array.isArray(avatar)) {
        next(new ApiError("You can upload only one photo", 400));
        return;
      }

      const { mimetype, size, name } = avatar as UploadedFile;

      if (size > avatarConfig.MAX_SIZE) {
        next(new ApiError(`File ${name} is too big`, 400));
        return;
      }

      if (!avatarConfig.MIMETYPES.includes(mimetype)) {
        next(new ApiError(`File ${name} has invalid format`, 400));
        return;
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}
export const fileMiddleware = new FileMiddleware();
