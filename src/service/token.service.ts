import jwt, { JwtPayload } from "jsonwebtoken";

import { configs } from "../config";
import { EActionTokenType, ETokenType } from "../enum";
import { ApiError } from "../error";
import { ITokenPair, ITokenPayload } from "../type";

class TokenService {
  public generateAccessAndRefreshToken(payload: ITokenPayload): ITokenPair {
    try {
      const accessToken = jwt.sign(payload, configs.ACCESS_SECRET, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign(payload, configs.REFRESH_SECRET, {
        expiresIn: "30d",
      });

      return { accessToken, refreshToken };
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public generateForgotAndActionToken(
    payload: ITokenPayload,
    tokenType: EActionTokenType
  ): string {
    try {
      let token;

      switch (tokenType) {
        case EActionTokenType.ACTION:
          token = jwt.sign(payload, "JWT_ACTION_TOKEN", { expiresIn: "7d" });
          break;
        case EActionTokenType.ACTIVATE:
          token = jwt.sign(payload, configs.ACTIVATE_SECRET, {
            expiresIn: "7d",
          });
          break;
      }

      return token;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public checkToken(
    token: string,
    tokenType: ETokenType | EActionTokenType
  ): string | JwtPayload {
    try {
      let secret;
      switch (tokenType) {
        case ETokenType.ACCESS:
          secret = configs.ACCESS_SECRET;
          break;
        case ETokenType.REFRESH:
          secret = configs.REFRESH_SECRET;
          break;
        case EActionTokenType.ACTIVATE:
          secret = configs.ACTIVATE_SECRET;
          break;
        case EActionTokenType.ACTION:
          secret = "JWT_ACTION_TOKEN";
          break;
      }

      return jwt.verify(token, secret);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const tokenService = new TokenService();
