import { Document } from "mongoose";

// import { EGenders } from "../enums";

export interface IUser extends Document {
    name?: string;
    age?: number;
    genders?: string;
    email?: string;
    password?: string;
}