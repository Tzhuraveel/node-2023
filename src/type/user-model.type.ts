import { Model } from "mongoose";

import { IUser } from "./user.type";

export interface UserModel extends Model<IUser> {
  createWithHashPassword(user: IUser): Promise<void>;
}
