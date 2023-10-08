import { IToken } from "../types";
import { Token } from "../models";
import { FilterQuery } from "mongoose";

class TokenRepository {
    public async create(dto: Partial<IToken>): Promise<IToken> {
        return await Token.create(dto)
    }

    public async deleteOne(params: FilterQuery<IToken>): Promise<void> {
        await Token.deleteOne(params)
    }

    public async findOne(params: FilterQuery<IToken>): Promise<IToken | null> {
        return await Token.findOne(params)
    }
}

export const tokenRepository = new TokenRepository()