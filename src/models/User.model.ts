import { Schema, model } from "mongoose";

import { EGenders } from "../enums";

const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        age: {
            type: Number,
            min: [1, "Minimum age is 1"],
            max: [1, "Maximum age is 255"],
        },
        genders: {
            type: String,
            enum: EGenders,
        },
        email: {
            type: String,
            require: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            require: true,
        }
    }, {
        timestamps: true,
        versionKey: false
    }
)


export const User = model("user", userSchema)