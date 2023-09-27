import { Document } from "mongoose";

import { EGenders } from "../enums";

export interface IUser extends Document {
    name: string;
    age?: string;
    genders?: EGenders;
    email: string;
    password: string;
}