import { NextFunction, Request, Response } from "express";

// import { ITokenType } from '../types';
import { ApiError } from "../errors";
import { actionTokenRepository, tokenRepository } from "../repositories";
import { tokenService } from "../services";
import { IActionTokenType } from "../types";

class AuthMiddleware {
  // public  checkAuthToken(tokenType: ITokenType) {
  //     return async (req: Request, res: Response, next: NextFunction) => {
  //         try {
  //             const token = req.get('Authorization');

  //             if (!token) {
  //                 throw new ApiError('No Token!!!', 401);
  //             }

  //             const payload = tokenService.checkToken(token, tokenType);

  //             const entity = await tokenRepository.findOne({ [`${tokenType}Token`]: token });

  //             if (!entity) {
  //                 throw new ApiError('Token not valid', 401);
  //             }

  //             if (req.res) {
  //                 req.res.locals.tokenPayload = payload;
  //                 req.res.locals[`${tokenType}Token`] = token;

  //             }

  //             next();
  //         } catch (error) {
  //             next(error);
  //         }
  //     }
  // }

  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const accessToken = req.get("Authorization");

      if (!accessToken) {
        throw new ApiError("No Token!", 401);
      }

      const payload = tokenService.checkToken(accessToken, "access");

      const entity = await tokenRepository.findOne({ accessToken });

      if (!entity) {
        throw new ApiError("Token not valid!", 401);
      }

      req.res.locals.tokenPayload = payload;
      req.res.locals.accessToken = accessToken;

      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const refreshToken = req.get("Authorization");

      if (!refreshToken) {
        throw new ApiError("No Token!", 401);
      }

      const payload = tokenService.checkToken(refreshToken, "refresh");

      const entity = await tokenRepository.findOne({ refreshToken });

      if (!entity) {
        throw new ApiError("Token not valid!", 401);
      }

      req.res.locals.tokenPayload = payload;
      req.res.locals.refreshToken = refreshToken;

      next();
    } catch (e) {
      next(e);
    }
  }

  public checkActionToken(action: IActionTokenType) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        let token = "";

        switch (action) {
          case "activate":
            token = req.query.actionToken as string;
            break;
          case "forgotPassword":
            token = req.params.token as string;
            break;
          default:
            throw new ApiError("Invalid action type", 400);
        }

        const entity = await actionTokenRepository.findOne({
          token,
        });

        if (!entity) {
          throw new ApiError("Not valid token", 400);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();
