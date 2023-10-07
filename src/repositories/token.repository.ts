import { IToken } from "../types";
import { Token } from "../models";

class TokenRepository {
    public async create(dto: Partial<IToken>): Promise<IToken> {
        return await Token.create(dto)
    }
}

export const tokenRepository = new TokenRepository()