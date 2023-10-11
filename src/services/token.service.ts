import * as jwt from "jsonwebtoken";

import { ITokenPayload, ITokenType, ITokensPair } from "../types";
import { configs } from "../config";
import { ApiError } from "../errors";

class TokenService {
    public generateTokenPair(payload: ITokenPayload): ITokensPair {
        const accessToken = jwt.sign(payload, configs.jwt.JWT_ACCESS_SECRET, {
            expiresIn: "1m"
        })
        const refreshToken = jwt.sign(payload, configs.jwt.JWT_REFRESH_SECRET, {
            expiresIn: "30d"
        })

        return {
            accessToken,
            refreshToken,
        }
    }

    public checkToken(token: string, type: ITokenType): ITokenPayload | void {
        try {
            const _type = {
                'access': {
                    secret: configs.jwt.JWT_ACCESS_SECRET
                },
                'refresh': {
                    secret: configs.jwt.JWT_REFRESH_SECRET
                },
            }

            if (!_type[type]) {
                throw new Error('Invalid token type');
            }

            return jwt.verify(token, _type[type].secret) as ITokenPayload

        } catch (error) {
            throw new ApiError('Token not valid!', 401);
        }
    }

    public generateActionToken(payload: ITokenPayload): string {
        return jwt.sign(payload, configs.jwt.JWT_ACTION_SECRET, {
            expiresIn: '1d'
        }) 
    }

    public checkActionToken(token: string): ITokenPayload {
        try {
            return jwt.verify(token, configs.jwt.JWT_ACTION_SECRET) as ITokenPayload
        } catch (error) {
            throw new ApiError('Token not valid!!!', 401)
        }
    }
}

export const tokenService = new TokenService()