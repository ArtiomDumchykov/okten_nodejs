import { Document } from "mongoose";

import { EUserStatus } from "../enums";
// import { EGenders } from "../enums";
export interface IUser extends Document {
  name?: string;
  age?: number;
  genders?: string;
  email: string;
  password: string;
  status: EUserStatus;
}

export type IUserCredentials = Pick<IUser, "email" | "password">;
export interface ISetNewPassword extends Pick<IUser, "password"> {
  newPassword: string;
}
