import { IError, ITokenPayload, ITokensPair, IUser, IUserCredentials } from "../types";
import { EActionTokenType, EEmailAction, EUserStatus } from "../enums";
import { ApiError } from "../errors";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { actionTokenRepository, tokenRepository, userRepository } from "../repositories";
import { emailService } from "./email.service";


class AuthService {
    public async register(dto: IUser): Promise<void> {
        try {
            if (dto.password) {
                const hashPassword = await passwordService.hash(dto.password);

                const user = await userRepository.register({ ...dto, password: hashPassword });

                const actionToken = tokenService.generateActionToken({
                    userId: user._id,
                    name: user.name
                })

                await actionTokenRepository.create({
                    token: actionToken,
                    type: EActionTokenType.activate,
                    _userId: user._id
                })

                await emailService.sendMail(dto.email, EEmailAction.REGISTER, {
                    name: dto.name,
                    actionToken,
                })

            } else {
                throw new ApiError("Password is undefined", 404)
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

            const isMatched = await passwordService.compare(dto.password, user.password);

            if (!isMatched) {
                throw new ApiError("Invalid credentials provided", 401);
            }

            const tokensPair = await tokenService.generateTokenPair({
                userId: user._id,
                name: user.name
            })

            await tokenRepository.create({ ...tokensPair, _userId: user._id });

            return tokensPair
        } catch (error) {
            const err = error as IError;
            throw new ApiError(err.message, err.status);
        }
    }

    public async refresh(payload: ITokenPayload, refreshToken: string): Promise<ITokensPair | void> {
        try {
            const tokensPair = tokenService.generateTokenPair({
                userId: payload.userId,
                name: payload.name
            })

            await Promise.all([
                tokenRepository.create({ ...tokensPair, _userId: payload.userId }),
                tokenRepository.deleteOne({ refreshToken })
            ])

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
            const payload = tokenService.checkActionToken(token);
            const entity = await actionTokenRepository.findOne({ token });

            if (!entity) {
                throw new ApiError('Not valid token', 400)
            }

            await Promise.all([
                actionTokenRepository.deleteManyByUserIdType(
                    payload.userId.toString(),
                    EActionTokenType.activate,
                ),
                userRepository.setStatus(payload.userId.toString(), EUserStatus.active)
            ])

        } catch (error) {
            const err = error as IError;
            throw new ApiError(err.message, err.status);
        }
    }

    public async sendActivationToken(payload: ITokenPayload): Promise<void> {
        try {
            const user = await userRepository.findById(payload.userId.toString())
            console.log(user?.status)
            if (user?.status !== EUserStatus.inactive) {
                throw new ApiError('User can\'t be activated', 403)
            }
            const actionToken = tokenService.generateActionToken({
                userId: payload.userId,
                name: payload.name
            })

            actionTokenRepository.create({
                token: actionToken,
                type: EActionTokenType.activate,
                _userId: user._id,
            }),

                await emailService.sendMail(user.email, EEmailAction.REGISTER, {
                    name: user.name,
                    actionToken
                })

        } catch (error) {
            const err = error as IError;
            throw new ApiError(err.message, err.status);
        }
    }
}

export const authService = new AuthService()