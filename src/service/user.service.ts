import { UploadedFile } from "express-fileupload";
import { Types } from "mongoose";

import { ApiError } from "../error";
import { User } from "../model";
import { IUser } from "../type";
import { s3Service } from "./s3.service";

export interface IPagination<T> {
  page: number;
  perPage: number;
  itemsCount: number;
  data: T;
}

class UserService {
  public async getByField(dbField: string, field: string): Promise<IUser> {
    try {
      return await User.findOne({ [dbField]: field });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async getById(id: Types.ObjectId): Promise<IUser> {
    try {
      return await User.findById(id);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async uploadAvatar(file: UploadedFile, user: IUser): Promise<IUser> {
    try {
      const avatarPath = await s3Service.uploadPhoto(file, "user", user._id);

      if (user.avatar) {
        await s3Service.deleteAvatar(user.avatar);
      }

      return await User.findByIdAndUpdate(
        user._id,
        { avatar: avatarPath },
        { new: true }
      );
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async deleteAvatar(user: IUser): Promise<void> {
    try {
      if (!user.avatar) {
        throw new ApiError("User doesn't have avatar", 422);
      }

      await s3Service.deleteAvatar(user.avatar);

      await User.updateOne(
        { _id: user._id },
        { $unset: { avatar: user.avatar } }
      );
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async getAll(query: any): Promise<IPagination<IUser[]>> {
    try {
      const { page = 1, limit = 5, ...searchObject } = query;

      const skip = limit * (page - 1);
      const users = await User.find(searchObject).limit(limit).skip(skip);

      const usersTotalCount = await User.count();

      return {
        page: +page,
        perPage: +limit,
        itemsCount: usersTotalCount,
        data: users,
      };
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const userService = new UserService();
