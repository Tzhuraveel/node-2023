import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  gender: string;
  status?: string;
  avatar?: string;
}
