import { Types } from "mongoose";

import { EActionTokenType, EEmailAction, EUserStatus } from "../enum";
import { ApiError } from "../error";
import { Token, User } from "../model";
import { Action } from "../model";
import {
  ITokenInfo,
  ITokenInfoForgotAndActivate,
  ITokenPair,
  ITokenPayload,
  IUser,
} from "../type";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

class AuthService {
  public async register(user: IUser): Promise<void> {
    try {
      await User.createWithHashPassword(user);

      console.log(user);

      const createdUser = await User.findOne({ email: user.email }).lean();

      await this.sendActionToken(
        createdUser,
        EActionTokenType.ACTIVATE,
        EEmailAction.ACTIVATE
      );
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async login(user: IUser, password: string): Promise<ITokenPair> {
    try {
      const isMatched = await passwordService.compare(password, user.password);

      if (!isMatched) {
        throw new ApiError("Wrong password or email", 400);
      }

      const tokenPair = tokenService.generateAccessAndRefreshToken({
        _id: user._id,
        name: user.name,
      });

      await Token.create({ _user_id: user._id, ...tokenPair });

      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async sendActionToken(
    user: IUser,
    tokenType: EActionTokenType,
    templateToken: EEmailAction
  ): Promise<void> {
    try {
      const token = tokenService.generateForgotAndActionToken(
        {
          _id: user._id,
          name: user.name,
        },
        tokenType
      );

      await Action.create({
        _user_id: user._id,
        actionToken: token,
        tokenType,
      });

      await emailService.sendMail(user, templateToken, {
        token,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async refresh(
    jwtPayload: ITokenPayload,
    tokenInfo: ITokenInfo
  ): Promise<ITokenPair> {
    try {
      const tokenPair = tokenService.generateAccessAndRefreshToken({
        _id: jwtPayload._id,
        name: jwtPayload.name,
      });

      await Promise.all([
        Token.create({
          _user_id: tokenInfo._user_id,
          ...tokenPair,
        }),
        Token.deleteOne({ refreshToken: tokenInfo.refreshToken }),
      ]);

      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async forgotPassword(user: IUser): Promise<void> {
    try {
      console.log(user);
      await this.sendActionToken(
        user,
        EActionTokenType.ACTION,
        EEmailAction.FORGOT_PASSWORD
      );
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async activate(
    userId: Types.ObjectId,
    tokenInfo: ITokenInfoForgotAndActivate
  ): Promise<void> {
    try {
      await Promise.all([
        User.updateOne(
          { _id: userId },
          { $set: { status: EUserStatus.active } }
        ),
        Action.deleteOne({ actionToken: tokenInfo.actionToken }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async changePassword(
    userId: Types.ObjectId,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await userService.getById(userId);

    const isMatched = await passwordService.compare(oldPassword, user.password);

    if (!isMatched) {
      throw new ApiError("Wrong old password", 400);
    }

    const hashedPassword = await passwordService.hash(newPassword);

    await User.updateOne({ _id: userId }, { password: hashedPassword });

    try {
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async updateForgotPassword(
    password: string,
    tokenInfo: ITokenInfoForgotAndActivate
  ): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(password);

      await Promise.all([
        User.updateOne(
          { _id: tokenInfo._user_id },
          { password: hashedPassword }
        ),
        Action.deleteOne({ actionToken: tokenInfo.actionToken }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
