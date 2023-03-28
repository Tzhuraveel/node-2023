import { Types } from "mongoose";

import { EActionTokenType } from "../enum";

export interface ITokenPayload {
  _id: Types.ObjectId;
  name: string;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenInfo {
  _user_id: string;
  accessToken: string;
  refreshToken: string;
}

export interface ITokenInfoForgotAndActivate {
  _user_id: string;
  actionToken: string;
  tokenType: EActionTokenType;
}
