import * as jwt from "jsonwebtoken";

import { ITokenPayload, ITokensPair } from "../types";
import { configs } from "../config";

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
}

export const tokenService = new TokenService()