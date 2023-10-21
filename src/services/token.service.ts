import * as jwt from "jsonwebtoken";

import { configs } from "../config";
import { EActionTokenType } from "../enums";
import { ApiError } from "../errors";
import { ITokenPayload, ITokensPair, ITokenType } from "../types";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokensPair {
    const accessToken = jwt.sign(payload, configs.jwt.JWT_ACCESS_SECRET, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign(payload, configs.jwt.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public checkToken(token: string, type: ITokenType): ITokenPayload {
    try {
      const _type = {
        access: {
          secret: configs.jwt.JWT_ACCESS_SECRET,
        },
        refresh: {
          secret: configs.jwt.JWT_REFRESH_SECRET,
        },
      };

      if (!_type[type]) {
        throw new Error("Invalid token type");
      }

      return jwt.verify(token, _type[type].secret) as ITokenPayload;
    } catch (error) {
      throw new ApiError("Token not valid!", 401);
    }
  }

  public generateActionToken(
    payload: ITokenPayload,
    type: EActionTokenType,
  ): string {
    try {
      let secret: string;

      switch (type) {
        case EActionTokenType.forgotPassword:
          secret = configs.jwt.JWT_FORGOT_SECRET;
          break;
        case EActionTokenType.activate:
          secret = configs.jwt.JWT_ACTIVATE_SECRET;
          break;
        case EActionTokenType.changedPassword:
          secret = configs.jwt.JWT_CHANGED_PASS_SECRET;
          break;
      }

      return jwt.sign(payload, secret, {
        expiresIn: "1d",
      });
    } catch (error) {}
  }

  public checkActionToken(
    token: string,
    tokenType: EActionTokenType,
  ): ITokenPayload {
    try {
      let secret: string;

      switch (tokenType) {
        case EActionTokenType.forgotPassword:
          secret = configs.jwt.JWT_FORGOT_SECRET;
          break;
        case EActionTokenType.activate:
          secret = configs.jwt.JWT_ACTIVATE_SECRET;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token not valid!", 401);
    }
  }
}

export const tokenService = new TokenService();
