import { NextFunction, Request, Response } from "express";

import { authService } from "../services";
import { ISetNewPassword, ITokenPayload, ITokensPair, IUser } from "../types";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      await authService.register(req.body);

      return res.sendStatus(201);
    } catch (error) {
      next(error);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokensPair>> {
    try {
      const tokensPair = await authService.login(req.body);

      return res.json(tokensPair);
    } catch (error) {
      next(error);
    }
  }

  public async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokensPair>> {
    try {
      const tokenPayload: ITokenPayload = req.res?.locals.tokenPayload;
      const refreshToken: string = req.res?.locals.refreshToken;

      const tokensPair = await authService.refresh(tokenPayload, refreshToken);

      return res.status(201).json(tokensPair);
    } catch (error) {
      next(error);
    }
  }

  public async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const accessToken = req.res?.locals.accessToken as string;

      await authService.logout(accessToken);

      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  public async logoutAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const tokenPayload: ITokenPayload = req.res?.locals.tokenPayload;

      await authService.logoutAll(tokenPayload.userId.toString());

      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  public async activate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const actionToken = req.query.actionToken as string;
      await authService.activate(actionToken);

      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  public async sendActivationToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const tokenPayload: ITokenPayload = req.res?.locals.tokenPayload;

      await authService.sendActivationToken(tokenPayload);

      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.res.locals;

      await authService.forgotPassword(user as IUser);

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  public async setForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await authService.setForgotPassword(
        req.params.token as string,
        req.body.newPassword,
      );

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
  public async setNewPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as ISetNewPassword;
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;

      await authService.setNewPassword(body, tokenPayload.userId.toString());

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
