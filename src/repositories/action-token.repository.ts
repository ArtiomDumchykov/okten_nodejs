import { FilterQuery } from "mongoose";

import { EActionTokenType } from "../enums";
import { ActionToken } from "../models";
import { IActionToken } from "../types";

export class ActionTokenRepository {
  public async create(dto: IActionToken): Promise<IActionToken> {
    return await ActionToken.create(dto);
  }

  public async findOne(
    params: FilterQuery<IActionToken>,
  ): Promise<IActionToken | null> {
    return await ActionToken.findOne(params);
  }

  public async deleteOne(params: FilterQuery<IActionToken>): Promise<void> {
    await ActionToken.deleteMany(params);
  }

  public async deleteManyByUserIdType(
    userId: string,
    type: EActionTokenType,
  ): Promise<void> {
    await ActionToken.deleteMany({ _userId: userId, type });
  }
}

export const actionTokenRepository = new ActionTokenRepository();
