import { EEmailAction } from "../enums";
import { ApiError } from "../errors";
import { tokenRepository, userRepository } from "../repositories";
import { IError, ITokenPayload, ITokensPair, IUserCredentials } from "../types";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(dto: IUserCredentials): Promise<void> {
    try {
      if (dto.password) {
        const hashPassword = await passwordService.hash(dto.password);

        const user = await userRepository.register({
          ...dto,
          password: hashPassword,
        });

        await emailService.sendMail(dto.email, EEmailAction.REGISTER, {
          name: user.name,
        });
      } else {
        throw new ApiError("Password is undefined", 404);
      }
    } catch (error) {
      const err = error as IError;
      throw new ApiError(err.message, err.status);
    }
  }

  public async login(dto: IUserCredentials): Promise<ITokensPair | void> {
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
  ): Promise<ITokensPair | void> {
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
}

export const authService = new AuthService();
