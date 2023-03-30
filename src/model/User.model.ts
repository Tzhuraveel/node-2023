import { model, Schema } from "mongoose";

import { EGenders, EUserStatus } from "../enum";
import { ApiError } from "../error";
import { passwordService } from "../service";
import { IUser, UserModel } from "../type";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    gender: {
      type: String,
      enum: EGenders,
    },
    status: {
      type: String,
      default: EUserStatus.inactive,
    },
    avatar: String || null,
  },
  { versionKey: false, timestamps: true }
);

userSchema.statics = {
  async createWithHashPassword(user: IUser): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(user.password);

      await this.create({ ...user, password: hashedPassword });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  },
};

userSchema.methods = {
  async comparePassword(password: string): Promise<void> {
    try {
      const isMatched = await passwordService.compare(password, this.password);

      if (isMatched) throw new ApiError("Wrong password or email", 400);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  },
};

export const User = model<IUser, UserModel>("user", userSchema);
