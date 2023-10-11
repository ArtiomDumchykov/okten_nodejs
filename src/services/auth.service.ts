import { ApiError } from "../errors";
import { tokenRepository, userRepository } from "../repositories";
import { IError, ITokensPair, IUserCredentials } from "../types";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(dto: IUserCredentials): Promise<void> {
    try {
      // Вынести в middleware проверку на уникальность почты
      const user = await userRepository.getOneByParams({ email: dto.email });

      if (user) {
        throw new ApiError("Email already exist", 409);
      }

      // Нужно ли это
      if (dto.password) {
        const hashPassword = await passwordService.hash(dto.password);
        // const hashPassword = await passwordService.hash(dto.password!)
        await userRepository.register({ ...dto, password: hashPassword });
      } else {
        // Нужно ли это
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
}

export const authService = new AuthService();
