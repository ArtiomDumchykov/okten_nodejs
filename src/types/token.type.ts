import { Document, Types } from "mongoose";

import { EActionTokenType } from "../enums";
import { IUser } from "./user.type";

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}
export interface ITokenPayload {
  userId: Types.ObjectId;
  name?: string;
}
export interface IToken extends Document {
  accessToken: string;
  refreshToken: string;
  _userId: Types.ObjectId | IUser;
}
export interface IActionTokenDocument extends Document {
  token: string;
  type: EActionTokenType;
  _userId: Types.ObjectId | IUser;
}

export type ITokenType = "access" | "refresh";

export interface IActionToken
  extends Pick<IActionTokenDocument, "token" | "type" | "_userId"> {}
