import { EActionTokenType, EEmailAction, EUserStatus } from "../enums";
import { ApiError } from "../errors";
import {
  actionTokenRepository,
  tokenRepository,
  userRepository,
} from "../repositories";
import {
  IError,
  ISetNewPassword,
  ITokenPayload,
  ITokensPair,
  IUser,
  IUserCredentials,
} from "../types";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(dto: IUser): Promise<void> {
    try {
      // Нужно ли это?
      if (!dto.password) {
        throw new ApiError("Password is undefined", 404);
      }
      const hashPassword = await passwordService.hash(dto.password);
      console.log(hashPassword);

      const user = await userRepository.register({
        ...dto,
        password: hashPassword,
      });

      console.log(user);

      const actionToken = tokenService.generateActionToken(
        {
          userId: user._id,
          name: user.name,
        },
        EActionTokenType.activate,
      );

      await actionTokenRepository.create({
        token: actionToken,
        type: EActionTokenType.activate,
        _userId: user._id,
      });

      await emailService.sendMail(dto.email, EEmailAction.REGISTER, {
        name: dto.name,
        actionToken,
      });
    } catch (error) {
      const err = error as IError;
      throw new ApiError(err.message, err.status);
    }
  }

  public async login(dto: IUserCredentials): Promise<ITokensPair> {
    try {
      const user = await userRepository.getOneByParams({ email: dto.email });

      if (!user) {
        throw new ApiError("Invalid credentials provided", 401);
      }

      const isMatched = await passwordService.compare(
        dto.password,
        user.password,
      );

      if (!isMatched) {
        throw new ApiError("Invalid credentials provided", 401);
      }

      const tokensPair = await tokenService.generateTokenPair({
        userId: user._id,
        name: user.name,
      });

      await tokenRepository.create({ ...tokensPair, _userId: user._id });

      return tokensPair;
    } catch (error) {
      const err = error as IError;
      throw new ApiError(err.message, err.status);
    }
  }

  public async refresh(
    payload: ITokenPayload,
    refreshToken: string,
  ): Promise<ITokensPair> {
    try {
      const tokensPair = tokenService.generateTokenPair({
        userId: payload.userId,
        name: payload.name,
      });

      await Promise.all([
        tokenRepository.create({ ...tokensPair, _userId: payload.userId }),
        tokenRepository.deleteOne({ refreshToken }),
      ]);

      return tokensPair;
    } catch (error) {
      const err = error as IError;
      throw new ApiError(err.message, err.status);
    }
  }

  public async logout(accessToken: string): Promise<void> {
    try {
      await tokenRepository.deleteOne({ accessToken });
    } catch (error) {
      const err = error as IError;
      throw new ApiError(err.message, err.status);
    }
  }

  public async logoutAll(userId: string): Promise<void> {
    try {
      await tokenRepository.deleteManyByUserId(userId);
    } catch (error) {
      const err = error as IError;
      throw new ApiError(err.message, err.status);
    }
  }

  public async activate(token: string): Promise<void> {
    try {
      const payload = tokenService.checkActionToken(
        token,
        EActionTokenType.activate,
      );
      const entity = await actionTokenRepository.findOne({ token });

      if (!entity) {
        throw new ApiError("Not valid token", 400);
      }

      await Promise.all([
        actionTokenRepository.deleteManyByUserIdType(
          payload.userId.toString(),
          EActionTokenType.activate,
        ),
        userRepository.setStatus(payload.userId.toString(), EUserStatus.active),
      ]);
    } catch (error) {
      const err = error as IError;
      throw new ApiError(err.message, err.status);
    }
  }

  public async sendActivationToken(payload: ITokenPayload): Promise<void> {
    try {
      const user = await userRepository.findById(payload.userId.toString());

      if (user?.status !== EUserStatus.inactive) {
        throw new ApiError("User can't be activated", 403);
      }
      const actionToken = tokenService.generateActionToken(
        {
          userId: payload.userId,
          name: payload.name,
        },
        EActionTokenType.activate,
      );

      actionTokenRepository.create({
        token: actionToken,
        type: EActionTokenType.activate,
        _userId: user._id,
      }),
        await emailService.sendMail(user.email, EEmailAction.REGISTER, {
          name: user.name,
          actionToken,
        });
    } catch (error) {
      const err = error as IError;
      throw new ApiError(err.message, err.status);
    }
  }

  public async forgotPassword(user: IUser): Promise<void> {
    try {
      const actionToken = tokenService.generateActionToken(
        {
          userId: user._id,
        },
        EActionTokenType.forgotPassword,
      );

      await Promise.all([
        actionTokenRepository.create({
          token: actionToken,
          type: EActionTokenType.forgotPassword,
          _userId: user._id,
        }),
        emailService.sendMail(user.email, EEmailAction.FORGOT_PASSWORD, {
          actionToken,
          name: user.name,
        }),
      ]);
    } catch (error) {
      const err = error as IError;
      throw new ApiError(err.message, err.status);
    }
  }

  public async setForgotPassword(
    actionToken: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const payload = tokenService.checkActionToken(
        actionToken,
        EActionTokenType.forgotPassword,
      );

      const entity = await actionTokenRepository.findOne({
        token: actionToken,
      });

      if (!entity) {
        throw new ApiError("Not valid token", 400);
      }

      const newHashedPassword = await passwordService.hash(newPassword);

      await Promise.all([
        userRepository.updateOneById(payload.userId.toString(), {
          password: newHashedPassword,
        }),
        actionTokenRepository.deleteOne({ token: actionToken }),
      ]);
    } catch (error) {
      const err = error as IError;
      throw new ApiError(err.message, err.status);
    }
  }

  public async setNewPassword(
    body: ISetNewPassword,
    userId: string,
  ): Promise<void> {
    try {
      const user = await userRepository.findById(userId);

      const actionToken = tokenService.generateActionToken(
        {
          userId: user._id,
        },
        EActionTokenType.changedPassword,
      );

      const isMatch = await passwordService.compare(
        body.password,
        user.password,
      );

      if (!isMatch) {
        throw new ApiError("Invalid password", 400);
      }

      const password = await passwordService.hash(body.newPassword);

      await Promise.all([
        userRepository.updateOneById(userId, { password }),
        emailService.sendMail(user.email, EEmailAction.CHANGED_PASSWORD, {
          actionToken,
          name: user.name,
        }),
        this.logoutAll(userId.toString()),
      ]);
    } catch (error) {
      const err = error as IError;
      throw new ApiError(err.message, err.status);
    }
  }
}

export const authService = new AuthService();
